<<<<<<< HEAD
import { cn } from "../../lib/cn";
=======
import { cn } from "../lib/cn";
>>>>>>> 4ae347f (Replace all @/ path aliases with relative paths)

export function Button({ className, ...props }) {
  return <button className={cn("inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-sm transition-colors focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-paper disabled:opacity-50 disabled:cursor-not-allowed", className)} {...props} />;
}
