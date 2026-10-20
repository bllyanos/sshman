import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  alias: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (alias: string) => void;
};

export function DeleteHostDialog({ alias, onOpenChange, onConfirm }: Props) {
  return (
    <AlertDialog open={alias !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete host?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="bg-yellow px-1 font-mono font-bold">{alias}</span> will be removed from your ssh config. A
            backup of the previous file is kept at <span className="font-mono">~/.ssh/config.bak</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => alias && onConfirm(alias)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
