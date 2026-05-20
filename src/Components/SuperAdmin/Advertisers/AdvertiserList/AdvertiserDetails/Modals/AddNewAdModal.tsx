import { useAddAdvertiserAdMutation } from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import { AddNewAdModalProps } from "@/Types/SuperAdmin/Advertisers/AdvertisersTypes";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Alert,
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

type AddAdFormState = {
  title: string;
  redirect_url: string;
  placement: string;
  start_date: string;
  end_date: string;
  imageFile: File | null;
};

const initialForm: AddAdFormState = {
  title: "",
  redirect_url: "",
  placement: "DASHBOARD_TOP",
  start_date: "",
  end_date: "",
  imageFile: null,
};

const getErrorMessage = (err: any) => {
  if (!err) return "Something went wrong";
  if (typeof err === "string") return err;
  const data = err?.data ?? err;
  if (typeof data === "string") return data;
  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.message === "string") return data.message;

  try {
    return JSON.stringify(data);
  } catch {
    return "Something went wrong";
  }
};

const toIsoStringOrNull = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const AddNewAdModal: React.FC<AddNewAdModalProps> = ({
  isOpen,
  toggleModal,
  advertiserAlias,
}) => {
  const [addAd, { isLoading }] = useAddAdvertiserAdMutation();

  const [formData, setFormData] = useState<AddAdFormState>(initialForm);
  const [touched, setTouched] = useState({
    title: false,
    image: false,
    redirect_url: false,
    placement: false,
    start_date: false,
    end_date: false,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(initialForm);
    setTouched({
      title: false,
      image: false,
      redirect_url: false,
      placement: false,
      start_date: false,
      end_date: false,
    });
    setSubmitError(null);
  }, [isOpen]);

  const errors = useMemo(() => {
    const next: Record<string, string> = {};

    if (!advertiserAlias) {
      next.advertiserAlias = "Missing advertiser information.";
    }

    if (!formData.title.trim()) {
      next.title = "Title is required.";
    }

    if (!formData.imageFile) {
      next.image = "Image is required.";
    }

    if (!formData.redirect_url.trim()) {
      next.redirect_url = "Redirect URL is required.";
    }

    if (!formData.placement.trim()) {
      next.placement = "Placement is required.";
    }

    if (!formData.start_date) {
      next.start_date = "Start date is required.";
    }

    if (!formData.end_date) {
      next.end_date = "End date is required.";
    }

    const startIso = formData.start_date
      ? toIsoStringOrNull(formData.start_date)
      : null;
    const endIso = formData.end_date
      ? toIsoStringOrNull(formData.end_date)
      : null;

    if (formData.start_date && !startIso) {
      next.start_date = "Invalid start date.";
    }

    if (formData.end_date && !endIso) {
      next.end_date = "Invalid end date.";
    }

    if (startIso && endIso) {
      if (new Date(endIso).getTime() <= new Date(startIso).getTime()) {
        next.end_date = "End date must be after start date.";
      }
    }

    return next;
  }, [advertiserAlias, formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name in touched) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      title: true,
      image: true,
      redirect_url: true,
      placement: true,
      start_date: true,
      end_date: true,
    });
    setSubmitError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const startIso = toIsoStringOrNull(formData.start_date);
    const endIso = toIsoStringOrNull(formData.end_date);
    if (!startIso || !endIso || !formData.imageFile) {
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title.trim());
    payload.append("image", formData.imageFile);
    payload.append("redirect_url", formData.redirect_url.trim());
    payload.append("placement", formData.placement.trim());
    payload.append("start_date", startIso);
    payload.append("end_date", endIso);

    try {
      await addAd({ alias: advertiserAlias, payload }).unwrap();
      toast.success("Ad created successfully.");
      toggleModal();
    } catch (err) {
      const msg = getErrorMessage(err);
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  const isSubmitDisabled =
    isLoading || !advertiserAlias || Object.keys(errors).length > 0;

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} centered>
      <ModalHeader toggle={toggleModal}>Add New Ad</ModalHeader>

      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {submitError ? <Alert color="danger">{submitError}</Alert> : null}
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="title">
                  Title <span className="text-danger">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.title && Boolean(errors.title)}
                  placeholder="Enter ad title"
                />
                <FormFeedback>{errors.title}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label for="image">
                  Image <span className="text-danger">*</span>
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, image: true }))
                  }
                  invalid={touched.image && Boolean(errors.image)}
                />
                <FormFeedback>{errors.image}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label for="redirect_url">
                  Redirect URL <span className="text-danger">*</span>
                </Label>
                <Input
                  id="redirect_url"
                  name="redirect_url"
                  value={formData.redirect_url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.redirect_url && Boolean(errors.redirect_url)}
                  placeholder="https://example.com"
                />
                <FormFeedback>{errors.redirect_url}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="12">
              <FormGroup>
                <Label for="placement">
                  Placement <span className="text-danger">*</span>
                </Label>
                <Input
                  id="placement"
                  name="placement"
                  type="select"
                  value={formData.placement}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.placement && Boolean(errors.placement)}
                >
                  <option value="DASHBOARD_TOP">Dashboard Top</option>
                  <option value="HOME_TOP">Home Top</option>
                  <option value="SIDEBAR">Sidebar</option>
                  <option value="FOOTER">Footer</option>
                </Input>
                <FormFeedback>{errors.placement}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="12"></Col>
            <Col md="12"></Col>
            <Col md="6">
              <FormGroup>
                <Label for="start_date">
                  Start Date <span className="text-danger">*</span>
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.start_date && Boolean(errors.start_date)}
                />
                <FormFeedback>{errors.start_date}</FormFeedback>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="end_date">
                  End Date <span className="text-danger">*</span>
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  invalid={touched.end_date && Boolean(errors.end_date)}
                />
                <FormFeedback>{errors.end_date}</FormFeedback>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggleModal} type="button">
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isSubmitDisabled}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="me-2" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddNewAdModal;
