import { useDeleteCaseDocumentMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Documents/DocumentsApi";
import { DocumentDeleteModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/DocumentsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import React from "react";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const DocumentDeleteModal: React.FC<DocumentDeleteModalProps> = ({
  isOpen,
  toggle,
  fileData,
  case_alias,
  fileAlias,
}) => {
  const [deleteCaseDocument, { isLoading }] = useDeleteCaseDocumentMutation();

  if (!fileData) {
    return null;
  }

  const handleDeleteFile = async () => {
    try {
      if (fileAlias) {
        await deleteCaseDocument({
          case_alias: case_alias,
          file_alias: fileAlias,
        }).unwrap();
        toast.success("File deleted successfully");
        toggle?.();
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Delete</h3>
      </ModalHeader>
      <ModalBody>
        Are you sure you want to delete the{" "}
        <span className="text-danger">
          {fileData?.file_type
            ? formatChoiceFieldValue(fileData.file_type)
            : "-"}
        </span>{" "}
        file?
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDeleteFile} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DocumentDeleteModal;
