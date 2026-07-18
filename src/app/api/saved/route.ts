import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.DB_NAME as string;

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

    const body = await request.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ message: "Listing ID is required." }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(dbName);
    const savedCollection = db.collection("saved_listings");

    // Check if already saved
    const existing = await savedCollection.findOne({
      userId: session.user.id,
      listingId: new ObjectId(listingId)
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "Listing already saved." });
    }

    await savedCollection.insertOne({
      userId: session.user.id,
      email: session.user.email,
      listingId: new ObjectId(listingId),
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, message: "Apartment saved successfully!" });
  } catch (error: unknown) {
    console.error("Failed to save listing:", error);
    return NextResponse.json({
      message: (error as Error).message || "Failed to save apartment."
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const client = await getMongoClient();
    const db = client.db(dbName);
    const savedCollection = db.collection("saved_listings");
    const listingsCollection = db.collection("listings");

    // Get user's saved items
    const savedItems = await savedCollection
      .find({ userId: session.user.id })
      .toArray();

    if (savedItems.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Retrieve full listings details for all saved listingIds
    const listingIds = savedItems.map(item => item.listingId);
    const listings = await listingsCollection
      .find({ _id: { $in: listingIds } })
      .toArray();

    // Map saved items to include listing details
    const data = savedItems.map(item => {
      const listing = listings.find(l => l._id.toString() === item.listingId.toString());
      return {
        _id: item._id, // saved_listings record id
        listingId: item.listingId,
        listing
      };
    }).filter(item => item.listing !== undefined);

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("Failed to fetch saved listings:", error);
    return NextResponse.json({
      message: (error as Error).message || "Failed to retrieve saved listings."
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
    const id = searchParams.get("id"); // saved record id OR listingId

    if (!id) {
      return NextResponse.json({ message: "Saved ID or Listing ID is required." }, { status: 400 });
    }

    const client = await getMongoClient();
    const db = client.db(dbName);
    const savedCollection = db.collection("saved_listings");

    // Delete by either saved _id OR matching listingId & userId
    const result = await savedCollection.deleteOne({
      $or: [
        { _id: new ObjectId(id), userId: session.user.id },
        { listingId: new ObjectId(id), userId: session.user.id }
      ]
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Saved listing not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Saved listing removed successfully." });
  } catch (error: unknown) {
    console.error("Failed to unsave listing:", error);
    return NextResponse.json({
      message: (error as Error).message || "Failed to remove saved listing."
    }, { status: 500 });
  }
}
