import * as SelectPrimitive from "@radix-ui/react-select";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ children, className = "", ...props }) {
  return <SelectPrimitive.Trigger className={`w-full flex items-center justify-between bg-white border border-line px-4 py-2.5 rounded-sm text-sm ${className}`} {...props}>{children}</SelectPrimitive.Trigger>;
}
export function SelectContent({ children }) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content className="z-50 bg-paper border border-line rounded-sm shadow-editorial p-1"><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>;
}
export function SelectItem({ children, value }) {
  return <SelectPrimitive.Item value={value} className="px-3 py-2 text-sm cursor-pointer outline-none rounded-sm data-[highlighted]:bg-[#EAF3EB]"><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText></SelectPrimitive.Item>;
}
