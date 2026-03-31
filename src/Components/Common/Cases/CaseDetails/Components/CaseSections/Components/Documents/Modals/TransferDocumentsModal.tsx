import { useUploadCaseDocumentMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Documents/DocumentsApi";
import { useGetCasesQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
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

  // Only allow target cases where customer email matches current case customer email
  const currentCase = caseData?.results?.find(
    (c: any) => c.alias === currentCaseAlias,
  );
  const currentCaseCustomerEmail =
    currentCase?.customer?.email?.toLowerCase() || "";

  const availableCases = caseData?.results.filter((caseItem: any) => {
    if (caseItem.alias === currentCaseAlias) return false;
    if (!currentCaseCustomerEmail) return false;
    const targetEmail = caseItem.customer?.email?.toLowerCase();
    return !!targetEmail && targetEmail === currentCaseCustomerEmail;
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
      (c: any) => c.alias === targetCaseAlias,
    );

    if (!targetCase) {
      toast.error("Target case not found");
      return;
    }

    if (!currentCaseCustomerEmail) {
      toast.error("Current case has no customer email");
      return;
    }

    const targetCaseCustomerEmail =
      targetCase.customer?.email?.toLowerCase() || "";
    if (!targetCaseCustomerEmail) {
      toast.error("Target case has no customer email");
      return;
    }

    if (targetCaseCustomerEmail !== currentCaseCustomerEmail) {
      toast.error("Customer email does not match between cases");
      return;
    }

    setIsTransferring(true);
    setTransferredCount(0);
    setTransferProgress(0);

    const documentArray = Array.from(selectedDocuments);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < documentArray.length; i++) {
        const documentAlias = documentArray[i];
        try {
          // Find the document object
          const document = allDocuments.find(
            (doc) => doc.alias === documentAlias,
          );

          if (!document || !document.file) {
            console.error(`Document ${documentAlias} not found or has no file`);
            failCount++;
            continue;
          }

          // Fetch the file via Next.js API route to avoid CORS
          const proxyResponse = await fetch("/api/documents/proxy-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl: document.file }),
          });

          if (!proxyResponse.ok) {
            let details = "";
            try {
              const data = (await proxyResponse.json()) as {
                error?: string;
                url?: string;
                status?: number;
              };
              const parts = [data?.error || ""];
              if (data?.status) parts.push(String(data.status));
              if (data?.url) parts.push(data.url);
              details = parts.filter(Boolean).join(" | ");
            } catch {
              try {
                details = await proxyResponse.text();
              } catch {
                // ignore
              }
            }

            throw new Error(
              details ||
                `Failed to fetch file: ${proxyResponse.status} ${proxyResponse.statusText}`,
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

          // Copy all file owners/customers if present
          if (
            Array.isArray(document.customer_info) &&
            document.customer_info.length > 0
          ) {
            document.customer_info.forEach((owner: any) => {
              if (owner.id) {
                formData.append("customer", owner.id.toString());
              }
            });
          }

          // Add document name if available
          // Build full name with title, first, middle, and last name from first owner
          if (document.name) {
            formData.append("name", document.name);
          } else if (
            Array.isArray(document.customer_info) &&
            document.customer_info.length > 0
          ) {
            const firstOwner = document.customer_info[0];

            if (firstOwner) {
              const ownerName = [
                firstOwner.title || "",
                firstOwner.first_name || "",
                firstOwner.middle_name || "",
                firstOwner.last_name || "",
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
            failCount > 0 ? `, ${failCount} failed` : ""
          }`,
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
