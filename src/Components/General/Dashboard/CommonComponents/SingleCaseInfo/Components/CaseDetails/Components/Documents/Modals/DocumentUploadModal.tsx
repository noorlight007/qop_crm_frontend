import { useUploadCaseDocumentMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Documents/DocumentsApi";
import { useGetCaseUsersQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseUsers/CaseUsersApi";
import {
  DocumentOwnerProps,
  DocumentUploadModalProps,
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

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const params = useParams();
  const { casealias } = params;
  const [fileOwners, setfileOwners] = useState<DocumentOwnerProps | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileErrors, setFileErrors] = useState<{ [key: number]: string[] }>({});

  // rtk hooks
  const { data: caseUsers, isLoading } = useGetCaseUsersQuery({
    case_alias: casealias,
  });
  const [uploadCaseDocument, { isLoading: isUploading }] =
    useUploadCaseDocumentMutation();

  const [formData, setFormData] = useState({
    file: "",
    fileType: "",
    fileOwner: 0,
    DocumentName: "",
    description: "",
    specialNotes: "",
  });

  useEffect(() => {
    if (caseUsers) {
      setfileOwners(caseUsers);
    }
  }, [caseUsers]);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const errors: { [key: number]: string[] } = {};

      // Validate each file
      filesArray.forEach((file, index) => {
        const fileErrors: string[] = [];

        // Check file size (limit to 10MB per file)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          fileErrors.push(
            `File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(
              2
            )}MB)`
          );
        }

        // Check filename length (max 100 characters)
        if (file.name.length > 100) {
          fileErrors.push(
            `Ensure this filename has at most 100 characters (it has ${file.name.length}).`
          );
        }

        if (fileErrors.length > 0) {
          errors[index] = fileErrors;
        }
      });

      setFileErrors(errors);
      setDocuments(filesArray);
    }
  };

  const removeFile = (indexToRemove: number) => {
    const newDocuments = documents.filter(
      (_, index) => index !== indexToRemove
    );
    const newErrors = { ...fileErrors };
    delete newErrors[indexToRemove];

    // Reindex errors for remaining files
    const reindexedErrors: { [key: number]: string[] } = {};
    Object.keys(newErrors).forEach((key) => {
      const oldIndex = parseInt(key);
      if (oldIndex > indexToRemove) {
        reindexedErrors[oldIndex - 1] = newErrors[oldIndex];
      } else if (oldIndex < indexToRemove) {
        reindexedErrors[oldIndex] = newErrors[oldIndex];
      }
    });

    setDocuments(newDocuments);
    setFileErrors(reindexedErrors);
  };

  const clearAllFiles = () => {
    setDocuments([]);
    setFileErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "fileOwner" ? Number(value) : value,
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    if (!formData.fileType || !formData.fileOwner) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Check if there are any file validation errors
    const hasErrors = Object.keys(fileErrors).length > 0;
    if (hasErrors) {
      toast.error("Please fix the file validation errors before uploading.");
      return;
    }

    try {
      // Upload each file individually
      let successCount = 0;
      let failedFiles: string[] = [];

      for (let i = 0; i < documents.length; i++) {
        const file = documents[i];
        setUploadProgress(Math.round(((i + 1) / documents.length) * 100));

        try {
          const uploadData = new FormData();

          // Append all fields including the current file
          uploadData.append("file", file);
          uploadData.append("file_type", formData.fileType);
          uploadData.append("file_owner", formData.fileOwner.toString());
          uploadData.append("name", formData.DocumentName || file.name);
          uploadData.append("description", formData.description);
          uploadData.append("special_notes", formData.specialNotes);

          await uploadCaseDocument({
            case_alias: casealias,
            payload: uploadData,
          }).unwrap();

          successCount++;
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          failedFiles.push(file.name);
        }
      }

      // Reset form data after upload attempts
      setDocuments([]);
      setUploadProgress(0);
      setFormData({
        file: "",
        fileType: "",
        fileOwner: 0,
        DocumentName: "",
        description: "",
        specialNotes: "",
      });

      // Show appropriate success/error messages
      if (successCount === documents.length) {
        toast.success(`All ${successCount} document(s) uploaded successfully!`);
        toggle();
      } else if (successCount > 0) {
        toast.warning(
          `${successCount} documents uploaded successfully. Failed: ${failedFiles.join(
            ", "
          )}`
        );
        toggle();
      } else {
        toast.error(
          `Failed to upload all documents: ${failedFiles.join(", ")}`
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadProgress(0);
      toast.error("Failed to upload documents.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Upload Document</span>
      </ModalHeader>
      <Form onSubmit={handleUpload}>
        <ModalBody>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="fileUpload" className="form-label">
                  Select Documents (Multiple files allowed)
                  <span className="text-danger">*</span>
                  <br />
                  <small className="text-muted">
                    Max file size: 10MB per file | Max filename length: 100
                    characters
                  </small>
                </Label>
                <Input
                  type="file"
                  id="fileUpload"
                  name="fileUpload"
                  multiple
                  onChange={handleDocumentChange}
                />
                {documents.length > 0 && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Selected files ({documents.length}):
                      </small>
                      {documents.length > 1 && (
                        <Button
                          color="warning"
                          size="sm"
                          outline
                          onClick={clearAllFiles}
                        >
                          <i className="fa fa-trash me-1"></i>
                          Clear All
                        </Button>
                      )}
                    </div>
                    {Object.keys(fileErrors).length > 0 && (
                      <div className="alert alert-danger mt-2 py-2 px-3">
                        <small>
                          <i className="fa fa-exclamation-triangle me-1"></i>
                          {Object.keys(fileErrors).length} file(s) have
                          validation errors. Please fix them before uploading.
                        </small>
                      </div>
                    )}
                    <ul className="list-unstyled mt-1 border rounded p-3 bg-dark-light">
                      {documents.map((file, index) => (
                        <li
                          key={index}
                          className={`py-2 border-bottom ${
                            fileErrors[index] ? "border-danger" : ""
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <i
                                  className={`fa fa-file me-1 ${
                                    fileErrors[index] ? "text-danger" : ""
                                  }`}
                                ></i>
                                <span
                                  className={`text-sm ${
                                    fileErrors[index] ? "text-danger" : ""
                                  }`}
                                >
                                  {file.name}
                                </span>
                                <small className="text-muted ms-2">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </small>
                              </div>
                              {fileErrors[index] && (
                                <div className="mt-1">
                                  {fileErrors[index].map(
                                    (error, errorIndex) => (
                                      <div
                                        key={errorIndex}
                                        className="text-danger small"
                                      >
                                        <i className="fa fa-exclamation-triangle me-1"></i>
                                        {error}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                            <Button
                              color="danger"
                              size="sm"
                              outline
                              onClick={() => removeFile(index)}
                              className="ms-2"
                            >
                              <i className="fa fa-times"></i>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="fileType" className="form-label">
                  Select Document Type<span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="fileType"
                  name="fileType"
                  value={formData.fileType}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="COMPLIANCE_DOCUMENTS">
                    Compliance Documents
                  </option>
                  <option value="FACT_FINDS">Fact Finds</option>
                  <option value="IDS">IDs</option>
                  <option value="PROOF_OF_ADDRESS">Proof of Address</option>
                  <option value="INCOME_DOCUMENTS">Income Documents</option>
                  <option value="BANK_STATEMENTS">Bank Statements</option>
                  <option value="PROOF_OF_DEPOSIT_BANK_STATEMENTS">
                    Proof of Deposit - Bank Statements
                  </option>
                  <option value="DONOR_DOCUMENTS">Donor Documents</option>
                  <option value="CREDIT_REPORT">Credit Report</option>
                  <option value="RESEARCH_DOCUMENTS">Research Documents</option>
                  <option value="LENDERS_KFI">Lender's KFI</option>
                  <option value="LENDERS_DIP">Lender's DIP</option>
                  <option value="LENDERS_FULL_MORTGAGE_APPLICATION">
                    Lender's Full Mortgage Application
                  </option>
                  <option value="LENDERS_OFFER">Lender's Offer</option>
                  <option value="SUITABILITY_LETTER">Suitability Letter</option>
                  <option value="GENERAL_INSURANCE_DOCUMENTS">
                    General Insurance Documents
                  </option>
                  <option value="PROTECTION_DOCUMENTS">
                    Protection Documents
                  </option>
                  <option value="AML_AND_SANCTIONS_SEARCH">
                    AML and Sanctions Search
                  </option>
                  <option value="OTHERS">Others</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="fileOwner" className="form-label">
                  Document Owner<span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="fileOwner"
                  name="fileOwner"
                  value={formData.fileOwner}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>

                  {/* Options for Joint Users */}
                  {Array.isArray(fileOwners) &&
                    fileOwners.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user?.title
                          ? user.title.charAt(0).toUpperCase() +
                            user.title.slice(1).toLowerCase()
                          : ""}
                        {"."} {user.first_name} {user.middle_name}{" "}
                        {user.last_name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="DocumentName" className="form-label">
                  Document Name
                  {documents.length > 1 && (
                    <small className="text-muted ms-2">
                      (Optional - file names will be used if empty)
                    </small>
                  )}
                </Label>
                <Input
                  type="text"
                  id="DocumentName"
                  name="DocumentName"
                  placeholder={
                    documents.length > 1
                      ? "Optional - individual file names will be used if empty"
                      : "Write your document name"
                  }
                  value={formData.DocumentName}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="description" className="form-label">
                  Description
                </Label>
                <Input
                  type="textarea"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              {" "}
              <FormGroup>
                <Label for="specialNotes" className="form-label">
                  Special Notes
                </Label>
                <Input
                  type="textarea"
                  id="specialNotes"
                  name="specialNotes"
                  placeholder="Enter special notes"
                  value={formData.specialNotes}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          {isUploading && documents.length > 1 && (
            <div className="w-100 mb-2">
              <small className="text-muted">
                Upload Progress: {uploadProgress}%
              </small>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
            </div>
          )}
          <Button color="secondary" onClick={toggle} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={isUploading || Object.keys(fileErrors).length > 0}
          >
            {isUploading
              ? `Uploading... (${uploadProgress}%)`
              : Object.keys(fileErrors).length > 0
              ? "Fix errors to upload"
              : `Upload ${
                  documents.length > 0 ? documents.length : ""
                } Document${documents.length !== 1 ? "s" : ""}`}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default DocumentUploadModal;
