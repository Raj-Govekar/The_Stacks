import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ children, className = "" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-paper border border-line p-6 shadow-editorial rounded-sm ${className}`}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 text-muted hover:text-ink transition-colors" aria-label="Close">×</DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export const DialogHeader = ({ children }) => <div className="mb-5">{children}</div>;
export const DialogTitle = ({ children, className = "" }) => <DialogPrimitive.Title className={className}>{children}</DialogPrimitive.Title>;
export const DialogFooter = ({ children }) => <div className="flex justify-end gap-2 pt-4">{children}</div>;
