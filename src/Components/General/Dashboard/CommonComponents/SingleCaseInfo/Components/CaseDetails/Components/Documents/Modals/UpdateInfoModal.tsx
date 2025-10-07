import { useUpdateCaseDocumentMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Documents/DocumentsApi";
import { useGetCaseUsersQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseUsers/CaseUsersApi";
import {
  CaseDocumentProps,
  DocumentOwnerProps,
} from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/DocumentsTypes";
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
  const [fileOwners, setfileOwners] = useState<DocumentOwnerProps | null>(null);
  const { data: caseUsers, isLoading: isLoadingCaseUsers } =
    useGetCaseUsersQuery({
      case_alias: casealias,
    });
  const [updateCaseDocument, { isLoading }] = useUpdateCaseDocumentMutation();

  // Form state
  const [formData, setFormData] = useState({
    fileOwner: 0,
    document_type: "",
    document_name: "",
  });

  useEffect(() => {
    if (caseUsers) {
      setfileOwners(caseUsers);
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
      // Find the current owner ID by matching with file_owner_info
      let currentOwnerId = 0;
      if (Array.isArray(fileOwners)) {
        const currentOwner = fileOwners.find(
          (user) =>
            user.first_name === documentData.file_owner_info?.first_name &&
            user.last_name === documentData.file_owner_info?.last_name &&
            user.email === documentData.file_owner_info?.email
        );
        currentOwnerId = currentOwner?.id || 0;
      }

      setFormData({
        fileOwner: currentOwnerId,
        document_type: documentData.file_type || "",
        document_name: documentData.name || "",
      });
    }
  }, [documentData, fileOwners]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fileOwner" ? Number(value) : value,
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
    if (!formData.fileOwner) {
      toast.error("Please select a document owner");
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
        file_owner: formData.fileOwner,
        file_type: formData.document_type,
        name: formData.document_name.trim(),
      };

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
      fileOwner: 0,
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
              <strong>Name:</strong> {documentData.name || "N/A"}
            </p>
            <p className="mb-0">
              <strong>Current Type:</strong>{" "}
              {documentData.file_type
                ? documentData.file_type
                    .split("_")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")
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
                <Label for="fileOwner">
                  Document Owner <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="fileOwner"
                  name="fileOwner"
                  value={formData.fileOwner}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select document owner...</option>
                  {Array.isArray(fileOwners) &&
                    fileOwners.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user?.title
                          ? user.title.charAt(0).toUpperCase() +
                            user.title.slice(1).toLowerCase()
                          : ""}
                        {user?.title ? ". " : ""}
                        {user.first_name} {user.middle_name} {user.last_name}
                      </option>
                    ))}
                </Input>
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
