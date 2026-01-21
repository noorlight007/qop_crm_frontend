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

    setNewFiles((prev) => [...prev, ...filesArray]);
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
                    key={file.alias}
                    className={`d-flex justify-content-between align-items-center py-2 px-2 ${
                      index !== existingFiles.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                      <div className="flex-grow-1 min-w-0">
                        <div
                          className="fw-medium text-truncate small"
                          title={file.ticket_file.split("/").pop()}
                        >
                          {file.ticket_file.split("/").pop()}
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
