import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.DB_NAME as string;

// Cached MongoClient connection helper
let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  if (!uri) throw new Error("MONGODB_URI environment variable is missing.");
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const payload = await request.json();

    const client = await getMongoClient();
    const db = client.db(dbName);
    const listingsCollection = db.collection("listings");

    const newListing = {
      ...payload,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      createdAt: new Date(),
    };

    const result = await listingsCollection.insertOne(newListing);

    return NextResponse.json({
      success: true,
      message: "Listing created successfully.",
      id: result.insertedId,
    }, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create listing:", error);
    return NextResponse.json({
      message: (error as Error).message || "Failed to submit listing. Please try again."
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const id = searchParams.get("id");

    const client = await getMongoClient();
    const db = client.db(dbName);
    const listingsCollection = db.collection("listings");

    if (id) {
      const listing = await listingsCollection.findOne({ _id: new ObjectId(id) });
      if (!listing) {
        return NextResponse.json({ success: false, message: "Listing not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: listing });
    }

    let query = {};
    if (email) {
      query = {
        $or: [
          { "user.email": email },
          { addedBy: email }
        ]
      };
    }

    const listings = await listingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: listings });
  } catch (error: unknown) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json({
      message: (error as Error).message || "Failed to retrieve listings."
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Listing ID is required." }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(dbName);
    const listingsCollection = db.collection("listings");

    // Retrieve listing to verify ownership
    const listing = await listingsCollection.findOne({ _id: new ObjectId(id) });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found." }, { status: 404 });
    }

    const ownerEmail = listing.addedBy || listing.user?.email;
    const isOwner = (listing.user?.id === session.user.id) || (ownerEmail === session.user.email);
    if (!isOwner) {
      return NextResponse.json({ message: "Forbidden. You do not own this listing." }, { status: 403 });
    }

    await listingsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Listing deleted successfully."
    });
  } catch (error: unknown) {
    console.error("Failed to delete listing:", error);
    return NextResponse.json({
      message: (error as Error).message || "Failed to delete listing. Please try again."
    }, { status: 500 });
  }
}
