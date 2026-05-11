import { useUpdateCompanyInfoMutation } from "@/Redux/Reducers/CompanyInfo/CompanyInfoApi";
import { UpdateCompanyInfoModalProps } from "@/Types/CompanyInfo/CompanyInfoTypes";
import { useEffect, useState } from "react";
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
  Spinner,
} from "reactstrap";

const getErrorMessage = (err: any) => {
  if (!err) return "Failed to update contact info.";
  if (typeof err === "string") return err;
  if (typeof err?.data === "string") return err.data;

  const collectMessages = (value: any): string[] => {
    if (value == null) return [];
    if (typeof value === "string") return [value];
    if (Array.isArray(value))
      return value.flatMap((item) => collectMessages(item));
    if (typeof value === "object") {
      return Object.values(value).flatMap((item) => collectMessages(item));
    }
    return [String(value)];
  };

  if (err?.data) {
    const dataMessages = collectMessages(err.data);
    if (dataMessages.length) return dataMessages.join(", ");
  }

  if (err?.error) return String(err.error);
  if (err?.message) return String(err.message);

  try {
    return JSON.stringify(err);
  } catch {
    return "Failed to update contact info.";
  }
};

const parseApiErrors = (errorData: any): Record<string, string[]> => {
  if (!errorData || typeof errorData !== "object") return {};

  const result: Record<string, string[]> = {};

  const addError = (key: string, value: any) => {
    if (value == null) return;
    if (typeof value === "string") {
      result[key] = [value];
      return;
    }
    if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === "string" ? item : JSON.stringify(item),
      );
      return;
    }
    if (typeof value === "object") {
      const nested = Object.values(value)
        .flatMap((item) =>
          Array.isArray(item)
            ? item.map((nestedItem) =>
                typeof nestedItem === "string"
                  ? nestedItem
                  : JSON.stringify(nestedItem),
              )
            : typeof item === "string"
              ? [item]
              : [JSON.stringify(item)],
        )
        .filter(Boolean);
      if (nested.length) {
        result[key] = nested;
      }
    }
  };

  Object.entries(errorData).forEach(([key, value]) => addError(key, value));

  return result;
};

const UpdateContactInfoModal: React.FC<UpdateCompanyInfoModalProps> = ({
  isOpen,
  toggle,
  companyInfo,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    primary_mobile: "",
    other_contact: "",
    contact_person: "",
    contact_person_designation: "",
    website: "",
    license_no: "",
  });
  const [licenseImageFile, setLicenseImageFile] = useState<File | null>(null);
  const [licenseImagePreview, setLicenseImagePreview] = useState("");
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  const [updateCompanyInfo, { isLoading: isUpdating }] =
    useUpdateCompanyInfoMutation();

  useEffect(() => {
    if (companyInfo && isOpen) {
      setFormData({
        email: companyInfo.email ?? "",
        primary_mobile: companyInfo.primary_mobile ?? "",
        other_contact: companyInfo.other_contact ?? "",
        contact_person: companyInfo.contact_person ?? "",
        contact_person_designation:
          companyInfo.contact_person_designation ?? "",
        website: companyInfo.website ?? "",
        license_no: companyInfo.license_no ?? "",
      });
      setLicenseImagePreview(companyInfo.license_image ?? "");
      setLicenseImageFile(null);
    }
  }, [companyInfo, isOpen]);

  useEffect(() => {
    if (!licenseImageFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(licenseImageFile);
    setLicenseImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [licenseImageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setLicenseImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiErrors({});

    try {
      const payload = licenseImageFile ? new FormData() : { ...formData };

      if (licenseImageFile && payload instanceof FormData) {
        payload.append("license_image", licenseImageFile);
        payload.append("email", formData.email);
        payload.append("primary_mobile", formData.primary_mobile);
        payload.append("other_contact", formData.other_contact);
        payload.append("contact_person", formData.contact_person);
        payload.append(
          "contact_person_designation",
          formData.contact_person_designation,
        );
        payload.append("website", formData.website);
        payload.append("license_no", formData.license_no);
      }

      await updateCompanyInfo({ payload }).unwrap();
      toast.success("Contact information updated successfully.");
      toggle();
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
      setApiErrors(parseApiErrors(error?.data?.errors ?? error?.data));
      console.error("UpdateContactInfoModal error:", error);
      try {
        console.error(
          "UpdateContactInfoModal error details:",
          JSON.stringify(error, null, 2),
        );
      } catch {
        console.error(
          "UpdateContactInfoModal error details could not be stringified",
          error,
        );
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>Update Contact Info</ModalHeader>
        <ModalBody>
          <Row className="gx-3">
            <Col md="6">
              <FormGroup>
                <Label for="email" className="fw-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter company email"
                />
                {apiErrors.email ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.email.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="primary_mobile" className="fw-semibold">
                  Primary Mobile
                </Label>
                <Input
                  id="primary_mobile"
                  name="primary_mobile"
                  type="text"
                  value={formData.primary_mobile}
                  onChange={handleChange}
                  placeholder="Enter primary mobile"
                />
                {apiErrors.primary_mobile ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.primary_mobile.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="other_contact" className="fw-semibold">
                  Other Contact
                </Label>
                <Input
                  id="other_contact"
                  name="other_contact"
                  type="text"
                  value={formData.other_contact}
                  onChange={handleChange}
                  placeholder="Enter additional contact number"
                />
                {apiErrors.other_contact ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.other_contact.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="contact_person" className="fw-semibold">
                  Contact Person
                </Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  type="text"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Enter contact person"
                />
                {apiErrors.contact_person ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.contact_person.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="contact_person_designation" className="fw-semibold">
                  Designation
                </Label>
                <Input
                  id="contact_person_designation"
                  name="contact_person_designation"
                  type="text"
                  value={formData.contact_person_designation}
                  onChange={handleChange}
                  placeholder="Enter designation"
                />
                {apiErrors.contact_person_designation ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.contact_person_designation.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="website" className="fw-semibold">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="text"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                />
                {apiErrors.website ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.website.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="license_no" className="fw-semibold">
                  License No
                </Label>
                <Input
                  id="license_no"
                  name="license_no"
                  type="text"
                  value={formData.license_no}
                  onChange={handleChange}
                  placeholder="Enter license number"
                />
                {apiErrors.license_no ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.license_no.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="license_image" className="fw-semibold">
                  License Image
                </Label>
                <Input
                  id="license_image"
                  name="license_image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {apiErrors.license_image ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.license_image.join(", ")}
                  </div>
                ) : null}
                {licenseImagePreview ? (
                  <div className="mt-3">
                    <img
                      src={licenseImagePreview}
                      alt="License preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: 100, objectFit: "contain" }}
                    />
                  </div>
                ) : (
                  <p className="text-muted mt-2 mb-0">
                    No license image selected.
                  </p>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} type="button">
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Spinner size="sm" className="me-2" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateContactInfoModal;
