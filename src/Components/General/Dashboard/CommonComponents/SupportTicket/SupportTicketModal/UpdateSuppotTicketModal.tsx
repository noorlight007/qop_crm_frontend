import { useUpdateSupportTicketMutation } from "@/Redux/Reducers/CommonComponents/SupportTicket/SupportTicketApi";
import {
  SupportTicketFormData,
  UpdateSupportTicketModalProps,
} from "@/Types/CommonComponents/SupportTicket/SupportTicketTypes";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
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
    subject: "",
    message: "",
    files: [],
  });

  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  // 🔹 NEW: Add a key to force input remount
  const [fileInputKey, setFileInputKey] = useState(0);

  const [updateSupportTicket, { isLoading: updateSupTicketLoading }] =
    useUpdateSupportTicketMutation();

  useEffect(() => {
    if (isOpen && selected) {
      setFormData({
        alias: selected.alias || "",
        ticket_type: selected.ticket_type || "",
        subject: selected.subject || "",
        message: selected.message || "",
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
        subject: "",
        message: "",
        files: [],
      });
      setExistingFiles([]);
      setNewFiles([]);
      setFileInputKey(0);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setNewFiles((prev) => [...prev, ...Array.from(files)]);
    setFileInputKey((prev) => prev + 1);
  };

  const removeExistingFile = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ticket_type || !formData.subject || !formData.message) {
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
        subject: formData.subject,
        message: formData.message,
        upload_files: [],
      };
    }
    // 🔹 CASE 2: Uploading or keeping files
    else {
      const fd = new FormData();
      fd.append("ticket_type", formData.ticket_type);
      fd.append("subject", formData.subject);
      fd.append("message", formData.message);

      if (shouldReplaceFiles) {
        // Re-upload remaining existing files
        for (const file of existingFiles) {
          const response = await fetch(file.ticket_file);
          const blob = await response.blob();
          const fileName = file.ticket_file.split("/").pop() || "file";
          const realFile = new File([blob], fileName, { type: blob.type });
          fd.append("upload_files", realFile);
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
      toggle();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update ticket");
      console.error("Error:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader className="text-center text-primary" toggle={toggle}>
        Update Support Ticket
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} id="support-ticket-form">
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
          </FormGroup>

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
          </FormGroup>

          <FormGroup>
            <Label for="message">
              Message<span className="text-danger">*</span>
            </Label>
            <Input
              id="message"
              name="message"
              type="textarea"
              rows={10}
              value={formData.message}
              onChange={handleChange}
              required
            />
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
          </FormGroup>

          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <FormGroup>
              <Label>Attached Files ({existingFiles.length})</Label>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "10px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {existingFiles.map((file, index) => (
                  <div
                    key={file.alias}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderBottom:
                        index !== existingFiles.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={file.ticket_file.split("/").pop()}
                        >
                          {file.ticket_file.split("/").pop()}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {file.size ? `${(file.size / 1024).toFixed(2)} KB` : ""}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingFile(index)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "#dc3545",
                        padding: "0",
                        marginLeft: "10px",
                      }}
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
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "10px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {newFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderBottom:
                        index !== newFiles.length - 1
                          ? "1px solid #f0f0f0"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={file.name}
                        >
                          {file.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {(file.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "20px",
                        cursor: "pointer",
                        color: "#dc3545",
                        padding: "0",
                        marginLeft: "10px",
                      }}
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