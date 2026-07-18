import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ id, label, placeholder, icon: Icon, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full select-none text-left">
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}
          <input
            id={id}
            ref={ref}
            placeholder={placeholder}
            className={`w-full py-3 ${
              Icon ? "pl-11" : "px-4"
            } pr-4 rounded-xl border ${
              error
                ? "border-rose-500/50 bg-rose-500/5 dark:bg-rose-950/10 focus:ring-rose-500/20 focus:border-rose-500 text-rose-600 dark:text-rose-450"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:ring-primary/10 dark:focus:ring-primary/15 focus:border-primary text-slate-900 dark:text-slate-100"
            } placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 text-sm font-semibold`}
            {...props}
          />
        </div>
        <div className="min-h-[1.25rem] overflow-hidden">
          {error && (
            <p className="text-xs text-rose-600 dark:text-rose-450 font-bold transition-all animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;
