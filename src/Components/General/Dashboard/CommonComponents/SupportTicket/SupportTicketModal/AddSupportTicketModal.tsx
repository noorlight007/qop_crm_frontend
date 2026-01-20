import { useCreateSupportTicketMutation } from "@/Redux/Reducers/CommonComponents/SupportTicket/SupportTicketApi";
import {
  AddSupportTicketFormData,
  AddSupportTicketModalProps,
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

const AddSupportTicketModal: React.FC<AddSupportTicketModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [formData, setFormData] = useState<AddSupportTicketFormData>({
    ticket_type: "",
    subject: "",
    message: "",
    files: [],
  });

  const [createSupportTicket, { isLoading: createSupTicketLoading }] =
    useCreateSupportTicketMutation();

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        ticket_type: "",
        subject: "",
        message: "",
        files: [],
      });
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...filesArray],
      }));
    }
    e.target.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ticket_type || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("ticket_type", formData.ticket_type);
    submissionData.append("subject", formData.subject);
    submissionData.append("message", formData.message);

    formData.files.forEach((file) => {
      submissionData.append("upload_files", file);
    });

    try {
      const result = await createSupportTicket({
        payload: submissionData,
      }).unwrap();

      if (result && result.alias) {
        toast.success("Ticket Created Successfully!!!");
        // Reset form
        setFormData({
          ticket_type: "",
          subject: "",
          message: "",
          files: [],
        });
        toggle();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create ticket");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader className="text-center text-primary" toggle={toggle}>
        Create Support Ticket
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} id="support-ticket-form">
          {/* Ticket Type */}
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

          {/* Subject */}
          <FormGroup>
            <Label for="subject">
              Subject<span className="text-danger">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter ticket subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {/* Message */}
          <FormGroup>
            <Label for="message">
              Message<span className="text-danger">*</span>
            </Label>
            <Input
              id="message"
              name="message"
              type="textarea"
              rows={10}
              placeholder="Describe your issue or feedback in detail"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>

          {/* Attachments */}
          <FormGroup>
            <Label for="files">Attachments (optional)</Label>
            <Input
              id="files"
              name="files"
              type="file"
              multiple
              onChange={handleFileChange}
            />
            <small className="text-muted">
              You can attach multiple files, screenshots or documents (if any)
            </small>
          </FormGroup>

          {/* File Preview Section */}
          {formData.files.length > 0 && (
            <FormGroup>
              <Label>Attached Files ({formData.files.length})</Label>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "10px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {formData.files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderBottom:
                        index !== formData.files.length - 1
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
                      onClick={() => handleRemoveFile(index)}
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
          color="secondary"
          onClick={toggle}
          disabled={createSupTicketLoading}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          type="submit"
          form="support-ticket-form"
          disabled={createSupTicketLoading}
        >
          {createSupTicketLoading ? "Submitting..." : "Submit Ticket"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddSupportTicketModal;
