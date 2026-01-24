import { useSendResetPasswordEmailMutation } from "@/Redux/Reducers/Common/UserProfile/UserProfileApi";
import { UserProfileModalProps } from "@/Types/Common/UserProfile/UserProfileType";
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
  const [cooldown, setCooldown] = useState(0);
  const [sentOnce, setSentOnce] = useState(false);

  const RESEND_KEY = "forgot_password_resend_expiry";
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESEND_KEY);
      if (raw) {
        const expiry = parseInt(raw, 10);
        const remaining = Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
        if (remaining > 0) setCooldown(remaining);
        else localStorage.removeItem(RESEND_KEY);
      }
    } catch (err) {
      localStorage.removeItem(RESEND_KEY);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(RESEND_KEY);
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

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
      setSentOnce(true);
      const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
      localStorage.setItem(RESEND_KEY, expiry.toString());
      setCooldown(5 * 60);
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
          {/* <Button color="primary">
            {isLoading ? <Spinner size="sm" /> : "Send Email"}
          // </Button> */}
          <div className="d-grid mt-3">
            <Button
              type="submit"
              color="primary"
              disabled={isLoading || cooldown > 0}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : cooldown > 0 ? (
                `Resend in ${formatTime(cooldown)}`
              ) : sentOnce ? (
                "Resend Email"
              ) : (
                "Send Email"
              )}
            </Button>
          </div>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default SendEmailForResetPasswordModal;
