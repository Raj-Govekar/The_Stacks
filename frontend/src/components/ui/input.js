import React from "react";

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input className={className || "w-full px-3 py-2 border rounded"} ref={ref} {...props} />
));
Input.displayName = "Input";