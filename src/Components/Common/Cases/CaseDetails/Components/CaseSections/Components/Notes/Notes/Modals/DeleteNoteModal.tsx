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
      <ModalHeader toggle={toggle}>Delete Note</ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete this note? This action cannot be
          undone.
        </p>
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
