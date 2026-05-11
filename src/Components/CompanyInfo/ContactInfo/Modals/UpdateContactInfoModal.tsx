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

      await updateCompanyInfo(payload).unwrap();
      toast.success("Contact information updated successfully.");
      toggle();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to update contact info.";
      toast.error(message);
      console.error("UpdateContactInfoModal error:", error);
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
