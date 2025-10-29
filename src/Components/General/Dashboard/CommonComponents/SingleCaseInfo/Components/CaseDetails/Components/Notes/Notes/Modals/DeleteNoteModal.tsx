import { useDeleteNoteMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Notes/NotesApi";
import { DeleteNoteModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/NotesAndTaskTypes";
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
        {selectedNote && (
          <div className="border p-2 mb-3 rounded bg-light-dark">
            <strong>Note:</strong>
            <div className="text-truncate">{selectedNote.note}</div>
          </div>
        )}
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
