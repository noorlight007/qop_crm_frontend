import { useDeleteNoteMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Notes/NotesApi";
import { DeleteNoteModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/NotesAndTaskTypes";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

const DeleteNoteModal: React.FC<DeleteNoteModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  selectedNote,
}) => {
  const [deleteNote, { isLoading }] = useDeleteNoteMutation();

  const handleDelete = async () => {
    try {
      const noteAlias = selectedNote?.alias;
      if (!noteAlias) {
        throw new Error("No note selected for deletion");
      }
      await deleteNote({ case_alias: caseAlias, note_alias: noteAlias });
      toggle();
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Delete Note</h3>
      </ModalHeader>
      <ModalBody>
        <p>Are you sure you want to delete this note?</p>

        <div className="border border-danger rounded p-3 bg-light mb-3">
          <p className="mb-2 fw-semibold text-danger">
            This action is irreversible.
          </p>
          <small className="text-muted">
            Deleting this note will permanently remove it from this case. This
            data cannot be restored.
          </small>
        </div>

        <div className="d-flex justify-content-end">
          <Button color="secondary" onClick={toggle} className="me-2">
            Cancel
          </Button>
          <Button color="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteNoteModal;
