import { useUpdateCaseDocumentMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Documents/DocumentsApi";
import { useGetCaseUsersQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseUsers/CaseUsersApi";
import {
  CaseDocumentProps,
  DocumentOwnerProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/DocumentsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

interface UpdateInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  documentData: CaseDocumentProps | null;
  caseAlias: string;
}

const UpdateInfoModal: React.FC<UpdateInfoModalProps> = ({
  isOpen,
  toggle,
  documentData,
  caseAlias,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [fileOwners, setfileOwners] = useState<DocumentOwnerProps[] | null>(
    null,
  );
  const { data: caseUsers, isLoading: isLoadingCaseUsers } =
    useGetCaseUsersQuery({
      case_alias: casealias,
    });
  const [updateCaseDocument, { isLoading }] = useUpdateCaseDocumentMutation();

  // Form state
  const [formData, setFormData] = useState({
    fileOwners: [] as number[], // Multiple owners with checkboxes
    document_type: "",
    document_name: "",
  });

  useEffect(() => {
    if (caseUsers) {
      setfileOwners(caseUsers as DocumentOwnerProps[]);
    }
  }, [caseUsers]);

  // Document type options
  const documentTypes = [
    { value: "COMPLIANCE_DOCUMENTS", label: "Compliance Documents" },
    { value: "FACT_FINDS", label: "Fact Finds" },
    { value: "IDS", label: "IDs" },
    { value: "PROOF_OF_ADDRESS", label: "Proof of Address" },
    { value: "INCOME_DOCUMENTS", label: "Income Documents" },
    { value: "BANK_STATEMENTS", label: "Bank Statements" },
    {
      value: "PROOF_OF_DEPOSIT_BANK_STATEMENTS",
      label: "Proof of Deposit - Bank Statements",
    },
    { value: "DONOR_DOCUMENTS", label: "Donor Documents" },
    { value: "CREDIT_REPORT", label: "Credit Report" },
    { value: "RESEARCH_DOCUMENTS", label: "Research Documents" },
    { value: "LENDERS_KFI", label: "Lender's KFI" },
    { value: "LENDERS_DIP", label: "Lender's DIP" },
    {
      value: "LENDERS_FULL_MORTGAGE_APPLICATION",
      label: "Lender's Full Mortgage Application",
    },
    { value: "LENDERS_OFFER", label: "Lender's Offer" },
    { value: "SUITABILITY_LETTER", label: "Suitability Letter" },
    {
      value: "GENERAL_INSURANCE_DOCUMENTS",
      label: "General Insurance Documents",
    },
    { value: "PROTECTION_DOCUMENTS", label: "Protection Documents" },
    { value: "AML_AND_SANCTIONS_SEARCH", label: "AML and Sanctions Search" },
    { value: "OTHERS", label: "Others" },
  ];

  // Initialize form data when document changes
  useEffect(() => {
    if (documentData && fileOwners) {
      // Find the current owner IDs by matching with customer_info or customer_info
      let currentOwnerIds: number[] = [];
      if (Array.isArray(fileOwners)) {
        // Normalize possible owner shapes from API into an array of owner-info objects
        type CustomerInfo = NonNullable<CaseDocumentProps["customer_info"]>;

        const customerInfoRaw = (
          documentData as unknown as {
            customer_info?: CustomerInfo | CustomerInfo[];
          }
        ).customer_info;

        const ownersArray: CustomerInfo[] = Array.isArray(customerInfoRaw)
          ? customerInfoRaw
          : customerInfoRaw
            ? [customerInfoRaw]
            : [];

        if (ownersArray.length > 0) {
          // Map owner infos to user ids by matching email or name
          const matchedIds = new Set<number>();
          ownersArray.forEach((ownerInfo) => {
            const match = fileOwners.find((user) => {
              const emailMatch =
                (user.lead_user?.email || "").toLowerCase() ===
                (ownerInfo.email || "").toLowerCase();
              const nameMatch =
                (user.first_name || "").toLowerCase() ===
                  (ownerInfo.first_name || "").toLowerCase() &&
                (user.last_name || "").toLowerCase() ===
                  (ownerInfo.last_name || "").toLowerCase();
              const leadNameMatch =
                (user.lead_user?.first_name || "").toLowerCase() ===
                  (ownerInfo.first_name || "").toLowerCase() &&
                (user.lead_user?.last_name || "").toLowerCase() ===
                  (ownerInfo.last_name || "").toLowerCase();
              return emailMatch || nameMatch || leadNameMatch;
            });
            if (match) matchedIds.add(match.id);
          });
          currentOwnerIds = Array.from(matchedIds);
        }
      }

      setFormData({
        fileOwners: currentOwnerIds, // Keep array for multiple selection
        document_type: documentData.file_type || "",
        document_name: documentData.name || "",
      });
    }
  }, [documentData, fileOwners]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes for multiple owner selection
  const handleOwnerChange = (ownerId: number) => {
    setFormData((prev) => ({
      ...prev,
      fileOwners: prev.fileOwners.includes(ownerId)
        ? prev.fileOwners.filter((id) => id !== ownerId)
        : [...prev.fileOwners, ownerId],
    }));
  };

  // Handle select all/clear all
  const handleSelectAll = () => {
    if (Array.isArray(fileOwners)) {
      setFormData((prev) => ({
        ...prev,
        fileOwners: fileOwners.map((user) => user.id),
      }));
    }
  };

  const handleClearAll = () => {
    setFormData((prev) => ({
      ...prev,
      fileOwners: [],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentData) {
      toast.error("No document selected");
      return;
    }

    // Validate required fields
    if (formData.fileOwners.length === 0) {
      toast.error("Please select at least one document owner");
      return;
    }

    if (!formData.document_type) {
      toast.error("Please select a document type");
      return;
    }

    if (!formData.document_name.trim()) {
      toast.error("Please enter a document name");
      return;
    }

    // Validate document name length (max 100 characters)
    if (formData.document_name.trim().length > 100) {
      toast.error("Document name must be at most 100 characters");
      return;
    }

    try {
      const payload = {
        // API expects 'customer' which can be a list of IDs for multiple owners
        customer: formData.fileOwners,
        file_type: formData.document_type,
        name: formData.document_name.trim(),
      } as any;

      await updateCaseDocument({
        case_alias: caseAlias,
        file_alias: documentData.alias,
        payload: payload,
      }).unwrap();

      toast.success("Document information updated successfully");
      toggle();
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document information");
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      fileOwners: [],
      document_type: "",
      document_name: "",
    });
    toggle();
  };

  if (!documentData) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} toggle={handleClose} centered size="lg">
      <ModalHeader toggle={handleClose}>
        <h4 className="text-primary">Update Document Information</h4>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {/* Document Info Display */}
          <div className="mb-4 p-3 bg-light-dark rounded">
            <h6 className="text-muted mb-2">Document Details:</h6>
            <p className="mb-1">
              <span className="text-muted">Name:</span>{" "}
              {documentData.name || "N/A"}
            </p>
            <p className="mb-0">
              <span className="text-muted">Current Type:</span>{" "}
              {documentData.file_type
                ? formatChoiceFieldValue(documentData.file_type)
                : "N/A"}
            </p>
          </div>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="document_name">
                  Document Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="document_name"
                  name="document_name"
                  value={formData.document_name}
                  onChange={handleInputChange}
                  placeholder="Enter document name..."
                  maxLength={100}
                  required
                />
                <small className="text-muted">
                  Maximum 100 characters ({formData.document_name.length}/100)
                </small>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>
                  Document Owner <span className="text-danger">*</span>
                </Label>
                <div className="border rounded p-3 bg-light-primary">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted">Select owners</span>
                    <div>
                      <Button
                        color="link"
                        size="sm"
                        className="p-0 me-3 text-primary"
                        onClick={handleSelectAll}
                        type="button"
                      >
                        All
                      </Button>
                      <Button
                        color="link"
                        size="sm"
                        className="p-0 text-primary"
                        onClick={handleClearAll}
                        type="button"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    {Array.isArray(fileOwners) &&
                      fileOwners.map((user) => {
                        const isChecked = formData.fileOwners.includes(user.id);
                        return (
                          <div key={user.id} className="form-check mb-2">
                            <Input
                              type="checkbox"
                              id={`owner-${user.id}`}
                              className="form-check-input"
                              checked={isChecked}
                              onChange={() => handleOwnerChange(user.id)}
                            />
                            <Label
                              className="form-check-label ms-2"
                              for={`owner-${user.id}`}
                            >
                              {user?.title
                                ? formatChoiceFieldValue(user.title)
                                : ""}
                              {user?.title ? " " : ""}
                              {user.first_name} {user.middle_name}{" "}
                              {user.last_name}
                            </Label>
                          </div>
                        );
                      })}
                  </div>
                  {formData.fileOwners.length > 0 && (
                    <small className="text-success">
                      {formData.fileOwners.length} owner(s) selected
                    </small>
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="document_type">
                  Document Type <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="document_type"
                  name="document_type"
                  value={formData.document_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select document type...</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating...
              </>
            ) : (
              "Update Information"
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateInfoModal;
