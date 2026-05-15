import { useUploadCaseDocumentMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/Documents/DocumentsApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetCaseUsersQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseUsers/CaseUsersApi";
import {
  DocumentOwnerProps,
  DocumentUploadModalProps,
} from "@/Types/Common/Cases/CaseDetails/CaseSections/DocumentsTypes";
import formatChoiceFieldValue from "@/utils/formatters";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Progress,
  Row,
} from "reactstrap";

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const params = useParams();
  const { casealias } = params;
  const [fileOwners, setfileOwners] = useState<DocumentOwnerProps[] | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileErrors, setFileErrors] = useState<{ [key: number]: string[] }>({});

  // rtk hooks
  const { data: caseUsers, isLoading } = useGetCaseUsersQuery({
    case_alias: casealias,
  });
  const [uploadCaseDocument, { isLoading: isUploading }] =
    useUploadCaseDocumentMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [formData, setFormData] = useState({
    file: "",
    fileType: "",
    // store multiple owners as number[]
    fileOwner: [] as number[],
    DocumentName: "",
    description: "",
    specialNotes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (caseUsers) {
      // assume caseUsers is an array
      setfileOwners(caseUsers as DocumentOwnerProps[]);
    }
  }, [caseUsers]);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const errors: { [key: number]: string[] } = {};

      // Validate each file
      filesArray.forEach((file, index) => {
        const fileErrors: string[] = [];

        // Check file size (limit to 50MB per file)
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
          fileErrors.push(
            `File size exceeds 50MB limit (${(file.size / 1024 / 1024).toFixed(
              2,
            )}MB)`,
          );
        }

        // Check filename length (max 100 characters)
        if (file.name.length > 100) {
          fileErrors.push(
            `Ensure this filename has at most 100 characters (it has ${file.name.length}).`,
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

  // Dropdown for owners
  const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);

  const toggleOwnerDropdown = () => setOwnerDropdownOpen((s) => !s);

  const toggleOwnerSelection = (ownerId: number) => {
    const current = Array.isArray(formData.fileOwner)
      ? [...formData.fileOwner]
      : [];
    const idx = current.indexOf(ownerId);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(ownerId);
    }
    setFormData({ ...formData, fileOwner: current });
  };

  const selectAllOwners = () => {
    if (!Array.isArray(fileOwners)) return;
    const allIds = fileOwners.map((u: any) => u.id);
    setFormData({ ...formData, fileOwner: allIds });
  };

  const clearOwners = () => setFormData({ ...formData, fileOwner: [] });

  // compute selected owner objects for display
  const selectedOwners = Array.isArray(fileOwners)
    ? fileOwners.filter(
        (u: any) =>
          Array.isArray(formData.fileOwner) &&
          formData.fileOwner.includes(u.id),
      )
    : [];

  const removeFile = (indexToRemove: number) => {
    const newDocuments = documents.filter(
      (_, index) => index !== indexToRemove,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement & HTMLSelectElement;
    setFormData({ ...formData, [name]: value } as any);
    setErrors((prev) => {
      if (!prev) return prev;
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const src = err?.data || err || {};
    const sanitize = (s: any) => String(s ?? "").replace(/^\s*\d+,\s*/g, "");

    const mapKey = (k: string) => {
      const mappings: Record<string, string> = {
        file_type: "fileType",
        fileType: "fileType",
        customer: "fileOwner",
        fileOwner: "fileOwner",
        name: "DocumentName",
        DocumentName: "DocumentName",
        description: "description",
        special_notes: "specialNotes",
        specialNotes: "specialNotes",
        file: "file",
      };
      return mappings[k] || k;
    };

    const walk = (obj: any) => {
      if (!obj) return;
      if (typeof obj === "string") {
        out.detail = sanitize(obj);
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((it) => {
          if (typeof it === "string") out.detail = sanitize(it);
          else walk(it);
        });
        return;
      }
      if (typeof obj === "object") {
        Object.entries(obj).forEach(([k, v]) => {
          const fk = mapKey(k);
          if (typeof v === "string" || typeof v === "number") {
            out[fk] = sanitize(v);
          } else if (Array.isArray(v)) {
            out[fk] = v.map(sanitize).join(" ");
          } else if (typeof v === "object") {
            Object.entries(v as any).forEach(([k2, v2]) => {
              const fk2 = mapKey(k2);
              if (Array.isArray(v2)) out[fk2] = v2.map(sanitize).join(" ");
              else out[fk2] = sanitize(v2);
            });
          }
        });
      }
    };

    walk(src);
    return out;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length === 0) {
      setErrors({ file: "Please select at least one file to upload." });
      toast.error("Please select at least one file to upload.");
      return;
    }

    // Validate required fields: fileType and at least one file owner
    const hasOwnerSelected = Array.isArray(formData.fileOwner)
      ? formData.fileOwner.length > 0
      : !!formData.fileOwner;

    if (!formData.fileType || !hasOwnerSelected) {
      const newErr: Record<string, string> = {};
      if (!formData.fileType) newErr.fileType = "This field is required.";
      if (!hasOwnerSelected) newErr.fileOwner = "Select at least one owner.";
      setErrors(newErr);
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

          // append multiple owners as repeated 'customer' entries
          if (
            Array.isArray(formData.fileOwner) &&
            formData.fileOwner.length > 0
          ) {
            formData.fileOwner.forEach((ownerId) => {
              uploadData.append("customer", ownerId.toString());
            });
          } else {
            uploadData.append(
              "customer",
              (formData.fileOwner as any).toString(),
            );
          }

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
          const parsed = parseApiErrors(fileError);
          setErrors((prev) => ({ ...(prev || {}), ...parsed }));
        }
      }

      // Reset form data after upload attempts
      setDocuments([]);
      setUploadProgress(0);
      setFormData({
        file: "",
        fileType: "",
        fileOwner: [],
        DocumentName: "",
        description: "",
        specialNotes: "",
      });

      // Show appropriate success/error messages
      if (successCount === documents.length) {
        toast.success(`All ${successCount} document(s) uploaded successfully!`);
        toggle();
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_documents: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
      } else if (successCount > 0) {
        toast.warning(
          `${successCount} documents uploaded successfully. Failed: ${failedFiles.join(
            ", ",
          )}`,
        );
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_documents: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        toggle();
      } else {
        toast.error(
          `Failed to upload all documents: ${failedFiles.join(", ")}`,
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadProgress(0);
      const parsed = parseApiErrors(error);
      if (Object.keys(parsed).length) setErrors(parsed);
      toast.error("Failed to upload documents.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
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
                    Max file size: 50MB per file | Max filename length: 100
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
                          <i className="fa fa-trash me-1"></i> Clear All
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
                                    ),
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

                <Dropdown
                  isOpen={ownerDropdownOpen}
                  toggle={toggleOwnerDropdown}
                >
                  <DropdownToggle
                    caret
                    color="light"
                    className="w-100 text-start py-2"
                    style={{
                      whiteSpace: "normal",
                      minHeight: 44,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {selectedOwners && selectedOwners.length > 0 ? (
                      <div className="d-flex flex-wrap" style={{ gap: 6 }}>
                        {selectedOwners.slice(0, 3).map((u: any) => (
                          <span
                            key={u.id}
                            className="badge bg-primary border text-truncate"
                            style={{ maxWidth: 200, display: "inline-block" }}
                            title={`${u.title ? u.title + " " : ""}${
                              u.first_name
                            } ${u.middle_name ? u.middle_name + " " : ""}${
                              u.last_name
                            }`}
                          >
                            {u.title
                              ? formatChoiceFieldValue(u.title) + " "
                              : null}
                            {u.first_name}{" "}
                            {u.middle_name ? u.middle_name + " " : ""}
                            {u.last_name}
                          </span>
                        ))}
                        {selectedOwners.length > 3 && (
                          <span className="badge bg-secondary text-white">
                            +{selectedOwners.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      "Select..."
                    )}
                  </DropdownToggle>
                  <DropdownMenu className="p-2" style={{ minWidth: 300 }}>
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">Select owners</small>
                      <div>
                        <Button
                          size="sm"
                          color="link"
                          onClick={selectAllOwners}
                        >
                          All
                        </Button>
                        <Button size="sm" color="link" onClick={clearOwners}>
                          Clear
                        </Button>
                      </div>
                    </div>
                    <div style={{ maxHeight: 200, overflowY: "auto" }}>
                      {Array.isArray(fileOwners) &&
                        fileOwners.map((user) => (
                          <div className="form-check" key={user.id}>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`owner-${user.id}`}
                              checked={
                                Array.isArray(formData.fileOwner) &&
                                formData.fileOwner.includes(user.id)
                              }
                              onChange={() => toggleOwnerSelection(user.id)}
                            />
                            <label
                              className="form-check-label ms-2"
                              htmlFor={`owner-${user.id}`}
                            >
                              {user?.title
                                ? formatChoiceFieldValue(user.title) + " "
                                : ""}
                              {user.first_name}{" "}
                              {user.middle_name ? user.middle_name + " " : ""}
                              {user.last_name}
                            </label>
                          </div>
                        ))}
                    </div>
                  </DropdownMenu>
                </Dropdown>
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
              <Progress
                animated
                striped
                value={uploadProgress}
                className="mb-3"
              >
                {uploadProgress}%
              </Progress>
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
