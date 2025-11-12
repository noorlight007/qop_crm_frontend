import { useGetCasesQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { useUploadCaseDocumentMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Documents/DocumentsApi";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Spinner,
} from "reactstrap";

export interface TransferDocumentsModalProps {
  isOpen: boolean;
  toggle: () => void;
  selectedDocuments: Set<string>;
  documentNames: Map<string, string>;
  currentCaseAlias: string;
  allDocuments: any[]; // Array of all document objects
  onTransferComplete?: () => void;
}

const TransferDocumentsModal: React.FC<TransferDocumentsModalProps> = ({
  isOpen,
  toggle,
  selectedDocuments,
  documentNames,
  currentCaseAlias,
  allDocuments,
  onTransferComplete,
}) => {
  // State
  const [targetCaseAlias, setTargetCaseAlias] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferredCount, setTransferredCount] = useState(0);

  // RTK hooks
  const { data: caseData, isLoading: isCaseLoading } =
    useGetCasesQuery(undefined);
  const [uploadCaseDocument] = useUploadCaseDocumentMutation();

  // Get all unique owner emails from selected documents
  const getOwnerEmails = (): Set<string> => {
    const emails = new Set<string>();
    selectedDocuments.forEach((docAlias) => {
      const document = allDocuments.find((doc) => doc.alias === docAlias);
      if (document && Array.isArray(document.file_owner_info)) {
        document.file_owner_info.forEach((owner: any) => {
          if (owner.email) {
            emails.add(owner.email.toLowerCase());
          }
        });
      }
    });
    return emails;
  };

  // Filter cases where lead_user email matches any owner email from selected documents
  const availableCases = caseData?.results.filter((caseItem: any) => {
    // Exclude current case
    if (caseItem.alias === currentCaseAlias) return false;

    // Get owner emails from selected documents
    const ownerEmails = getOwnerEmails();

    // Check if case lead_user email matches any owner email
    const leadUserEmail = caseItem.lead_user?.email?.toLowerCase();
    return leadUserEmail && ownerEmails.has(leadUserEmail);
  });

  const handleTransfer = async () => {
    if (!targetCaseAlias) {
      toast.error("Please select a target case");
      return;
    }

    if (selectedDocuments.size === 0) {
      toast.error("No documents selected");
      return;
    }

    // Get target case details
    const targetCase = caseData?.results.find(
      (c: any) => c.alias === targetCaseAlias
    );

    if (!targetCase || !targetCase.lead_user?.email) {
      toast.error("Target case not found or has no lead user");
      return;
    }

    const targetLeadEmail = targetCase.lead_user.email.toLowerCase();

    setIsTransferring(true);
    setTransferredCount(0);
    setTransferProgress(0);

    const documentArray = Array.from(selectedDocuments);
    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    try {
      for (let i = 0; i < documentArray.length; i++) {
        const documentAlias = documentArray[i];
        try {
          // Find the document object
          const document = allDocuments.find(
            (doc) => doc.alias === documentAlias
          );

          if (!document || !document.file) {
            console.error(`Document ${documentAlias} not found or has no file`);
            failCount++;
            continue;
          }

          // Check if any owner's email matches the target case lead_user email
          const hasMatchingOwner =
            Array.isArray(document.file_owner_info) &&
            document.file_owner_info.some(
              (owner: any) => owner.email?.toLowerCase() === targetLeadEmail
            );

          if (!hasMatchingOwner) {
            console.log(
              `Document ${documentAlias} skipped - no matching owner for target case`
            );
            skippedCount++;
            setTransferProgress(((i + 1) / documentArray.length) * 100);
            continue;
          }

          // Fetch the file via Next.js API route to avoid CORS
          const proxyResponse = await fetch("/api/documents/proxy-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl: document.file }),
          });

          if (!proxyResponse.ok) {
            throw new Error(
              `Failed to fetch file: ${proxyResponse.statusText}`
            );
          }

          const blob = await proxyResponse.blob();
          const fileName =
            document.name ||
            document.file.split("/").pop() ||
            `document_${documentAlias}`;
          const file = new File([blob], fileName, { type: blob.type });

          // Create FormData for POST request
          const formData = new FormData();
          formData.append("file", file);
          formData.append("file_type", document.file_type || "OTHERS");

          // Only add file owners whose email matches the target case lead_user
          if (
            Array.isArray(document.file_owner_info) &&
            document.file_owner_info.length > 0
          ) {
            const matchingOwners = document.file_owner_info.filter(
              (owner: any) => owner.email?.toLowerCase() === targetLeadEmail
            );

            matchingOwners.forEach((owner: any) => {
              if (owner.id) {
                formData.append("file_owner", owner.id.toString());
              }
            });
          }

          // Add document name if available
          // Build full name with title, first, middle, and last name from matching owner
          if (document.name) {
            formData.append("name", document.name);
          } else if (
            Array.isArray(document.file_owner_info) &&
            document.file_owner_info.length > 0
          ) {
            // Generate name from matching owner
            const matchingOwner = document.file_owner_info.find(
              (owner: any) => owner.email?.toLowerCase() === targetLeadEmail
            );

            if (matchingOwner) {
              const ownerName = [
                matchingOwner.title || "",
                matchingOwner.first_name || "",
                matchingOwner.middle_name || "",
                matchingOwner.last_name || "",
              ]
                .filter(Boolean)
                .join(" ")
                .trim();

              if (ownerName) {
                formData.append("name", `${ownerName} - ${fileName}`);
              }
            }
          }

          // Add description if available
          if (document.description) {
            formData.append("description", document.description);
          }

          // Add special notes if available
          if (document.special_notes) {
            formData.append("special_notes", document.special_notes);
          }

          await uploadCaseDocument({
            case_alias: targetCaseAlias,
            payload: formData,
          }).unwrap();

          successCount++;
          setTransferredCount(successCount);
          setTransferProgress(((i + 1) / documentArray.length) * 100);
        } catch (error) {
          console.error(`Failed to transfer document ${documentAlias}:`, error);
          failCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(
          `Successfully transferred ${successCount} document(s)${
            skippedCount > 0
              ? `, ${skippedCount} skipped (no matching owner)`
              : ""
          }${failCount > 0 ? `, ${failCount} failed` : ""}`
        );
      } else if (skippedCount > 0) {
        toast.warning(
          `All ${skippedCount} document(s) were skipped - no matching owners for target case`
        );
      } else {
        toast.error("Failed to transfer documents");
      }

      // Reset and close
      setTimeout(() => {
        setIsTransferring(false);
        setTransferProgress(0);
        setTransferredCount(0);
        setTargetCaseAlias("");
        toggle();
        if (onTransferComplete) {
          onTransferComplete();
        }
      }, 1000);
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("An error occurred during transfer");
      setIsTransferring(false);
    }
  };

  const handleClose = () => {
    if (!isTransferring) {
      setTargetCaseAlias("");
      setTransferProgress(0);
      setTransferredCount(0);
      toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} centered size="lg">
      <ModalHeader toggle={handleClose}>Transfer Documents</ModalHeader>
      <ModalBody>
        {!isTransferring ? (
          <>
            <div className="mb-4">
              <h6 className="text-muted mb-2">
                Documents to Transfer ({selectedDocuments.size})
              </h6>
              <ul
                className="list-unstyled border rounded p-3 bg-light-dark"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {Array.from(selectedDocuments).map((docAlias, index) => (
                  <li key={index} className="py-1 border-bottom">
                    <i className="fa fa-file me-2 text-primary"></i>
                    {documentNames.get(docAlias) || docAlias}
                  </li>
                ))}
              </ul>
            </div>

            <FormGroup>
              <Label for="caseSelect">
                Select Target Case <span className="text-danger">*</span>
              </Label>

              {isCaseLoading ? (
                <div className="text-center py-3">
                  <Spinner size="sm" color="primary" />
                  <span className="ms-2">Loading cases...</span>
                </div>
              ) : (
                <Input
                  id="caseSelect"
                  className="form-control"
                  type="select"
                  value={targetCaseAlias}
                  onChange={(e) => setTargetCaseAlias(e.target.value)}
                  disabled={isTransferring}
                >
                  <option value="">-- Select a case --</option>
                  {availableCases && availableCases.length > 0 ? (
                    availableCases.map((caseItem: any) => (
                      <option key={caseItem.alias} value={caseItem.alias}>
                        {caseItem.name || caseItem.alias}
                      </option>
                    ))
                  ) : (
                    <option disabled>No other cases available</option>
                  )}
                </Input>
              )}
            </FormGroup>

            <div className="alert alert-info mt-3">
              <i className="fa fa-info-circle me-2"></i>
              <strong>Note:</strong> Selected documents will be moved from the
              current case to the target case.
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <h5>Transferring Documents...</h5>
            <p className="text-muted">
              Transferred {transferredCount} of {selectedDocuments.size}{" "}
              documents
            </p>
            <Progress
              color="primary"
              animated
              value={transferProgress}
              className="mb-3"
            >
              {Math.round(transferProgress)}%
            </Progress>
            <Spinner color="primary" />
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={handleClose}
          disabled={isTransferring}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleTransfer}
          disabled={
            isTransferring || !targetCaseAlias || selectedDocuments.size === 0
          }
        >
          {isTransferring ? (
            <>
              <Spinner size="sm" className="me-2" />
              Transferring...
            </>
          ) : (
            <>
              <i className="fa fa-exchange-alt me-2"></i>
              Transfer {selectedDocuments.size} Document(s)
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TransferDocumentsModal;
