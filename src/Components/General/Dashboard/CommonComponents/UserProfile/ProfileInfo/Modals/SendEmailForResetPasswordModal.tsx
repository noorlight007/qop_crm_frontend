import { useSendResetPasswordEmailMutation } from "@/Redux/Reducers/CommonComponents/UserProfile/UserProfileApi";
import { UserProfileModalProps } from "@/Types/CommonComponents/UserProfile/UserProfileType";
import { useEffect, useState } from "react";
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
  Spinner,
} from "reactstrap";

const SendEmailForResetPasswordModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [form, setForm] = useState({
    email: "",
  });
  useEffect(() => {
    if (initialData) {
      setForm({
        email: initialData.email || "",
      });
    }
  }, [initialData, isOpen]);
  const [sendResetPasswordEmail, { isLoading }] =
    useSendResetPasswordEmailMutation();

  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sendResetPasswordEmail({ email: form.email });
      toast.success("Reset password email sent successfully.");
      onClose();
    } catch (error) {
      console.error("Error sending reset password email:", error);
      toast.error("Failed to send reset password email.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered>
      <ModalHeader toggle={onClose}>
        <h3 className="text-primary">Send Reset Password Email</h3>
      </ModalHeader>
      <Form onSubmit={handelSubmit}>
        <ModalBody>
          <p>
            An email will be sent to <strong>{form.email || "—"}</strong> with
            instructions to reset your password.
          </p>
          <FormGroup>
            <Label for="resetEmail">Email*</Label>
            <Input
              id="resetEmail"
              type="email"
              value={form.email}
              readOnly
              placeholder="user@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={onClose}>
            Close
          </Button>
          <Button color="primary">
            {isLoading ? <Spinner size="sm" /> : "Send Email"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default SendEmailForResetPasswordModal;
