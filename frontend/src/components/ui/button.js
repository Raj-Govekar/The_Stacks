import React from "react";

export const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button className={className || "px-4 py-2 rounded"} ref={ref} {...props} />
));
Button.displayName = "Button";