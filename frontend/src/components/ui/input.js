<<<<<<< HEAD
import { cn } from "../../lib/cn";
=======
import { cn } from "../lib/cn";
>>>>>>> 4ae347f (Replace all @/ path aliases with relative paths)

export function Input({ className, ...props }) {
  return <input className={cn("w-full bg-white border border-line px-4 py-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-green text-sm", className)} {...props} />;
}
