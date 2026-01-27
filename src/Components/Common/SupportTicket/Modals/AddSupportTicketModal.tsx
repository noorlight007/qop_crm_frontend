import { useCreateSupportTicketMutation } from "@/Redux/Reducers/Common/SupportTicket/SupportTicketApi";
import {
  AddSupportTicketFormData,
  AddSupportTicketModalProps,
} from "@/Types/Common/SupportTicket/SupportTicketTypes";
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    // clear per-field API error on change
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const oversizedFile = filesArray.find((f) => f.name.length > 100);

      if (oversizedFile) {
        toast.error(
          `Ensure this filename has at most 100 characters (it has ${oversizedFile.name.length}).`,
        );
        e.target.value = "";
        return;
      }

      // clear file related api errors
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.upload_files;
        return copy;
      });

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
        setErrors({});
        toggle();
      }
    } catch (error: any) {
      // parse API validation errors and show under fields
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

      // If there are nested field keys like upload_files.0, flatten to upload_files
      const flattened: Record<string, string> = {};
      Object.keys(parsed).forEach((k) => {
        const base = k.split(".")[0];
        if (!flattened[base]) flattened[base] = parsed[k];
      });

      setErrors(flattened);

      const firstMsg =
        Object.values(flattened)[0] ||
        parsed.non_field_error ||
        "Failed to create ticket";
      toast.error(firstMsg);
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
            {errors.ticket_type && (
              <div className="text-danger">{errors.ticket_type}</div>
            )}
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
            {errors.subject && (
              <div className="text-danger">{errors.subject}</div>
            )}
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
            {errors.message && (
              <div className="text-danger">{errors.message}</div>
            )}
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
            {errors.upload_files && (
              <div className="text-danger">{errors.upload_files}</div>
            )}
            <small className="text-muted">
              You can attach multiple files, screenshots or documents (if any)
            </small>
          </FormGroup>

          {/* File Preview Section */}
          {formData.files.length > 0 && (
            <FormGroup>
              <Label>Attached Files ({formData.files.length})</Label>

              <div
                className="border rounded p-2 overflow-auto"
                style={{ maxHeight: "200px" }}
              >
                {formData.files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className={`d-flex justify-content-between align-items-center py-2 px-2 ${
                      index !== formData.files.length - 1 ? "border-bottom" : ""
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
                      <div className="flex-grow-1 min-w-0">
                        <div
                          className="fw-medium text-truncate"
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
                      onClick={() => handleRemoveFile(index)}
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
