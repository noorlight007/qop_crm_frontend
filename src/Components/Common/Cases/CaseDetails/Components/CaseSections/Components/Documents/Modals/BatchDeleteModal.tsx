import { useDeleteCaseDocumentMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Documents/DocumentsApi";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
} from "reactstrap";

interface BatchDeleteModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedDocuments: Set<string>;
  documentNames: Map<string, string>;
  case_alias: string;
  onDeleteComplete: () => void;
}

const BatchDeleteModal: React.FC<BatchDeleteModalProps> = ({
  isOpen,
  toggle,
  selectedDocuments,
  documentNames,
  case_alias,
  onDeleteComplete,
}) => {
  const [deleteCaseDocument] = useDeleteCaseDocumentMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);

  const handleBatchDelete = async () => {
    setIsDeleting(true);
    setDeleteProgress(0);
    setDeletedCount(0);

    const documentsArray = Array.from(selectedDocuments);
    let successCount = 0;
    let failedDocuments: string[] = [];

    for (let i = 0; i < documentsArray.length; i++) {
      const documentAlias = documentsArray[i];
      try {
        await deleteCaseDocument({
          case_alias: case_alias,
          file_alias: documentAlias,
        }).unwrap();
        successCount++;
        setDeletedCount(successCount);
      } catch (error) {
        console.error(`Error deleting document ${documentAlias}:`, error);
        const docName = documentNames.get(documentAlias) || documentAlias;
        failedDocuments.push(docName);
      }

      // Update progress
      setDeleteProgress(Math.round(((i + 1) / documentsArray.length) * 100));
    }

    setIsDeleting(false);

    // Show results
    if (successCount === documentsArray.length) {
      toast.success(`All ${successCount} documents deleted successfully!`);
    } else if (successCount > 0) {
      toast.warning(
        `${successCount} documents deleted successfully. Failed to delete: ${failedDocuments.join(
          ", ",
        )}`,
      );
    } else {
      toast.error(`Failed to delete documents: ${failedDocuments.join(", ")}`);
    }

    onDeleteComplete();
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-danger">Confirm Batch Delete</h3>
      </ModalHeader>
      <ModalBody>
        {!isDeleting ? (
          <>
            <p>
              Are you sure you want to delete{" "}
              <span className="text-danger fw-bold">
                {selectedDocuments.size}
              </span>{" "}
              selected document(s)?
            </p>
            <div className="mt-3">
              <strong>Documents to be deleted:</strong>
              <ul
                className="list-unstyled mt-2 border rounded p-3 bg-dark-light"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {Array.from(selectedDocuments).map((docAlias, index) => (
                  <li key={index} className="py-1 border-bottom">
                    <i className="fa fa-file me-2 text-danger"></i>
                    {documentNames.get(docAlias) || docAlias}
                  </li>
                ))}
              </ul>
            </div>
            <div className="alert alert-warning mt-3">
              <i className="fa fa-exclamation-triangle me-2"></i>
              <strong>Warning:</strong> This action cannot be undone.
            </div>
          </>
        ) : (
          <div className="text-center">
            <h5>Deleting Documents...</h5>
            <p>
              Deleted {deletedCount} of {selectedDocuments.size} documents
            </p>
            <Progress
              color="danger"
              animated
              striped
              value={deleteProgress}
              className="mb-3"
            >
              {deleteProgress}%
            </Progress>
            <small className="text-muted">
              Please wait while we delete the selected documents.
            </small>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        {!isDeleting ? (
          <>
            <Button color="danger" onClick={handleBatchDelete}>
              <i className="fa fa-trash me-1"></i>
              Delete {selectedDocuments.size} Document(s)
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </>
        ) : (
          <Button color="secondary" disabled>
            Deleting... ({deleteProgress}%)
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default BatchDeleteModal;
