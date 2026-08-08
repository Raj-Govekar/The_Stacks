import * as A from "@radix-ui/react-alert-dialog";

export const AlertDialog = A.Root;
export const AlertDialogTrigger = A.Trigger;
export const AlertDialogCancel = A.Cancel;
export const AlertDialogAction = A.Action;

export function AlertDialogContent({ children, className = "" }) {
  return (
    <A.Portal>
      <A.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <A.Content className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 bg-paper border border-line p-6 rounded-sm shadow-editorial ${className}`}>
        {children}
      </A.Content>
    </A.Portal>
  );
}
export const AlertDialogHeader = ({ children }) => <div className="mb-5">{children}</div>;
export const AlertDialogTitle = ({ children, className = "" }) => <A.Title className={className}>{children}</A.Title>;
export const AlertDialogDescription = ({ children }) => <A.Description className="text-sm text-muted mt-2">{children}</A.Description>;
export const AlertDialogFooter = ({ children }) => <div className="flex justify-end gap-2 mt-6">{children}</div>;
