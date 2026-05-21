import { useAddAdvertiserMutation } from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import {
  AddAdvertiserForm,
  AddAdvertiserModalProps,
} from "@/Types/SuperAdmin/Advertisers/AdvertisersTypes";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";

const initialForm: AddAdvertiserForm = {
  company_name: "",
  contact_email: "",
  website: "",
};

const getErrorMessage = (err: any) => {
  if (!err) return "Something went wrong";

  if (typeof err === "string") return err;

  const data = err?.data ?? err;

  if (typeof data === "string") return data;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  // Get first error message only
  if (typeof data === "object") {
    const firstValue = Object.values(data)[0];

    if (Array.isArray(firstValue)) {
      return firstValue[0];
    }

    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return "Something went wrong";
};

const isValidEmail = (value: string) => {
  const v = value.trim();
  if (!v) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

const AddAdvertiserModal: React.FC<AddAdvertiserModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  const [addAdvertiser, { isLoading }] = useAddAdvertiserMutation();

  const [formData, setFormData] = useState<AddAdvertiserForm>(initialForm);
  const [touched, setTouched] = useState({
    company_name: false,
    contact_email: false,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(initialForm);
    setTouched({ company_name: false, contact_email: false });
    setSubmitError(null);
  }, [isOpen]);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof AddAdvertiserForm, string>> = {};
    if (!formData.company_name.trim()) {
      next.company_name = "Company name is required.";
    }
    if (!formData.contact_email.trim()) {
      next.contact_email = "Contact email is required.";
    } else if (!isValidEmail(formData.contact_email)) {
      next.contact_email = "Enter a valid email address.";
    }
    return next;
  }, [formData.company_name, formData.contact_email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }) as AddAdvertiserForm);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === "company_name" || name === "contact_email") {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ company_name: true, contact_email: true });
    setSubmitError(null);

    if (errors.company_name || errors.contact_email) return;

    const payload: any = {
      company_name: formData.company_name.trim(),
      contact_email: formData.contact_email.trim(),
    };
    const website = formData.website.trim();
    if (website) payload.website = website;

    try {
      await addAdvertiser(payload).unwrap();
      toast.success("Advertiser created successfully.");
      toggleModal();
    } catch (err) {
      const msg = getErrorMessage(err);
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal}>
        <h3 className="text-primary">Add Advertiser</h3>
      </ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {submitError ? <Alert color="danger">{submitError}</Alert> : null}

          <FormGroup>
            <Label for="company_name">
              Company Name <span className="text-danger">*</span>
            </Label>
            <Input
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.company_name && Boolean(errors.company_name)}
              placeholder="Enter company name"
            />
            <FormFeedback>{errors.company_name}</FormFeedback>
          </FormGroup>

          <FormGroup>
            <Label for="contact_email">
              Contact Email <span className="text-danger">*</span>
            </Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              onBlur={handleBlur}
              invalid={touched.contact_email && Boolean(errors.contact_email)}
              placeholder="user@example.com"
            />
            <FormFeedback>{errors.contact_email}</FormFeedback>
          </FormGroup>

          <FormGroup className="mb-0">
            <Label for="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="example.com or https://example.com"
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" type="button" onClick={toggleModal}>
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={
              isLoading ||
              Boolean(errors.company_name) ||
              Boolean(errors.contact_email)
            }
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddAdvertiserModal;
