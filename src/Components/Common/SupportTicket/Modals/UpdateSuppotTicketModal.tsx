import { useUpdateSupportTicketMutation } from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import {
  SupportTicketFormData,
  UpdateSupportTicketModalProps,
} from "@/Types/Common/SupportTicket/SupportTicketTypes";
import { useSession } from "next-auth/react";
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

const UpdateSupportTicketModal: React.FC<UpdateSupportTicketModalProps> = ({
  isOpen,
  toggle,
  selected,
  onSave,
}) => {
  const [formData, setFormData] = useState<SupportTicketFormData>({
    alias: "",
    ticket_type: "",
    priority: "",
    status: "",
    subject: "",
    files: [],
  });
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [updateSupportTicket, { isLoading: updateSupTicketLoading }] =
    useUpdateSupportTicketMutation();

  useEffect(() => {
    if (isOpen && selected) {
      setFormData({
        alias: selected.alias || "",
        ticket_type: selected.ticket_type || "",
        priority: selected.priority || "",
        status: selected.status || "",
        subject: selected.subject || "",
        files: [],
      });
      setExistingFiles(selected.files || []);
      setNewFiles([]);
      setFileInputKey(0);
    }
  }, [isOpen, selected]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        alias: "",
        ticket_type: "",
        priority: "",
        status: "",
        subject: "",
        files: [],
      });
      setExistingFiles([]);
      setNewFiles([]);
      setFileInputKey(0);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const MAX_LENGTH = 100;

    // Find if any new file exceeds the limit
    const oversizedFile = filesArray.find((f) => f.name.length > MAX_LENGTH);

    if (oversizedFile) {
      toast.error(
        `Ensure this filename has at most ${MAX_LENGTH} characters (it has ${oversizedFile.name.length}).`,
      );
      setFileInputKey((prev) => prev + 1);
      return;
    }

    // clear any file upload related errors
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.upload_files;
      return copy;
    });

    setNewFiles((prev) => [...prev, ...filesArray]);
    setFileInputKey((prev) => prev + 1);
  };

  const removeExistingFile = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.upload_files;
      return copy;
    });
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.upload_files;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ticket_type || !formData.subject) {
      toast.error("Please fill in all required fields");
      return;
    }

    const totalFilesCount = existingFiles.length + newFiles.length;
    const originalFilesCount = selected?.files?.length || 0;
    const shouldReplaceFiles =
      totalFilesCount !== originalFilesCount || newFiles.length > 0;

    let submissionData: any;

    // 🔹 CASE 1: Clearing all files
    if (shouldReplaceFiles && totalFilesCount === 0) {
      submissionData = {
        ticket_type: formData.ticket_type,
        priority: formData.priority,
        status: formData.status,
        subject: formData.subject,
        upload_files: [],
      };
    }
    // 🔹 CASE 2: Uploading or keeping files
    else {
      const fd = new FormData();
      fd.append("ticket_type", formData.ticket_type);
      fd.append("subject", formData.subject);
      fd.append("priority", formData.priority || "");

      if (userRole === "ADMIN") {
        fd.append("status", formData.status || "");
      }

      if (shouldReplaceFiles) {
        // Re-upload remaining existing files (skip any entries without a URL)
        for (const file of existingFiles) {
          if (!file?.file) {
            // nothing to re-upload for this entry
            continue;
          }
          try {
            const response = await fetch(String(file.file));
            const blob = await response.blob();
            const fileName =
              String(file.file).split("/").pop() || file?.alias || "file";
            const realFile = new File([blob], fileName, { type: blob.type });
            fd.append("upload_files", realFile);
          } catch (err) {
            // Skip files that cannot be fetched (keep UX resilient)
            console.warn(
              "Skipping existing file (failed to fetch):",
              file,
              err,
            );
            continue;
          }
        }

        // Upload new files
        newFiles.forEach((file) => {
          fd.append("upload_files", file);
        });
      }
      submissionData = fd;
    }

    try {
      await updateSupportTicket({
        payload: submissionData,
        ticket_alias: formData.alias,
      }).unwrap();

      toast.success("Ticket Updated Successfully!!!");
      onSave(formData);
      setErrors({});
      toggle();
    } catch (error: any) {
      // parse API validation errors and set per-field messages
      const parsed: Record<string, string> = {};
      const sanitize = (s: string) => s.replace(/^\s*\d+,\s*/g, "").trim();
      const data = error?.data || error;

      if (data?.errors && typeof data.errors === "object") {
        Object.keys(data.errors).forEach((k) => {
          const v = data.errors[k];
          if (Array.isArray(v)) parsed[k] = sanitize(String(v[0]));
          else parsed[k] = sanitize(String(v));
        });
      } else if (data?.message && typeof data.message === "string") {
        parsed.non_field_error = sanitize(data.message);
      } else if (typeof data === "string") {
        parsed.non_field_error = sanitize(data);
      }

      const flattened: Record<string, string> = {};
      Object.keys(parsed).forEach((k) => {
        const base = k.split(".")[0];
        if (!flattened[base]) flattened[base] = parsed[k];
      });

      setErrors(flattened);
      const firstMsg =
        Object.values(flattened)[0] ||
        parsed.non_field_error ||
        "Failed to update ticket";
      toast.error(firstMsg);
      console.error("Error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader className="text-center text-primary" toggle={toggle}>
        <h3>Update Support Ticket</h3>
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} id="support-ticket-form">
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="ticket_type">
                  Ticket Type<span className="text-danger">*</span>
                </Label>
                <Input
                  id="ticket_type"
                  name="ticket_type"
                  type="select"
                  value={formData.ticket_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select ticket type</option>
                  <option value="FEEDBACK">Feedback</option>
                  <option value="BUG_REPORT">Bug Report</option>
                  <option value="FEATURE_REQUEST">Feature Request</option>
                </Input>
                {errors.ticket_type && (
                  <div className="text-danger">{errors.ticket_type}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="priority">
                  Priority<span className="text-danger">*</span>
                </Label>
                <Input
                  id="priority"
                  name="priority"
                  type="select"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="URGENT">Urgent</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="NORMAL">Normal</option>
                  <option value="WHEN_POSSIBLE">When Possible</option>
                </Input>
                {errors.priority && (
                  <div className="text-danger">{errors.priority}</div>
                )}
              </FormGroup>
            </Col>
          </Row>

          {userRole === "ADMIN" && (
            <FormGroup>
              <Label for="status">
                Status<span className="text-danger">*</span>
              </Label>
              <Input
                id="status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="RESOLVED">Resolved</option>
              </Input>
              {errors.status && (
                <div className="text-danger">{errors.status}</div>
              )}
            </FormGroup>
          )}

          <FormGroup>
            <Label for="subject">
              Subject<span className="text-danger">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            {errors.subject && (
              <div className="text-danger">{errors.subject}</div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="files">Attachments (optional)</Label>
            <Input
              id="files"
              type="file"
              multiple
              onChange={handleFileChange}
              key={fileInputKey}
            />
            {errors.upload_files && (
              <div className="text-danger">{errors.upload_files}</div>
            )}
            <small className="text-muted">
              You can attach multiple files, screenshots or documents (if any)
            </small>
          </FormGroup>

          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <FormGroup>
              <Label>Attached Files ({existingFiles.length})</Label>

              <div
                className="border rounded p-2 overflow-auto"
                style={{ maxHeight: "200px" }}
              >
                {existingFiles.map((file, index) => (
                  <div
                    key={file.alias || file.file || index}
                    className={`d-flex justify-content-between align-items-center py-2 px-2 ${
                      index !== existingFiles.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                      <div className="flex-grow-1 min-w-0">
                        <div
                          className="fw-medium text-truncate small"
                          title={
                            (file?.file &&
                              String(file.file).split("/").pop()) ||
                            file?.alias ||
                            "file"
                          }
                        >
                          {(file?.file && String(file.file).split("/").pop()) ||
                            file?.alias ||
                            "file"}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExistingFile(index)}
                      className="btn btn-link text-danger p-0 ms-2 fs-4 text-decoration-none"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </FormGroup>
          )}

          {/* New Files */}
          {newFiles.length > 0 && (
            <FormGroup>
              <Label>New Files ({newFiles.length})</Label>

              <div
                className="border rounded p-2 overflow-auto"
                style={{ maxHeight: "200px" }}
              >
                {newFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className={`d-flex justify-content-between align-items-center py-2 px-2 ${
                      index !== newFiles.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                      <div className="flex-grow-1 min-w-0">
                        <div
                          className="text-truncate fw-medium small"
                          title={file.name}
                        >
                          {file.name}
                        </div>

                        <div className="text-muted small">
                          {(file.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="btn btn-link text-danger p-0 ms-2 fs-4 text-decoration-none"
                      title="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </FormGroup>
          )}
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button
          color="warning"
          onClick={toggle}
          disabled={updateSupTicketLoading}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          form="support-ticket-form"
          disabled={updateSupTicketLoading}
        >
          {updateSupTicketLoading ? "Updating..." : "Update Ticket"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateSupportTicketModal;
