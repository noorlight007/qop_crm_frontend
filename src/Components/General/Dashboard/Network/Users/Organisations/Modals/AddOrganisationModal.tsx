import { useAddOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/OrganisationListApi";
import {
  AddOrganisationModalProps,
  AddOrganisationProps,
} from "@/Types/Network/OrganisationsTypes";
import { useState } from "react";
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
} from "reactstrap";

const AddOrganisationModal: React.FC<AddOrganisationModalProps> = ({
  isOpen,
  toggleModal,
}) => {
  const [formData, setFormData] = useState<AddOrganisationProps>({
    name: "",
    email: "",
    logo: null,
    profile_image: null,
    hero_image: null,
    primary_mobile: "",
    other_contact: "",
    contact_person: "",
    contact_person_designation: "",
    website: "",
    license_no: "",
    license_image: null,
    is_removed: false,
  });
  // rtk hooks
  const [addOrganisation, { isLoading }] = useAddOrganisationMutation();

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input changes (for images)
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof AddOrganisationProps
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        [fieldName]: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      // Append all form fields to FormData
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key] as any);
        }
      }
      // Replace axios with RTK Query mutation
      const response = await addOrganisation({
        payload: formDataToSend,
      }).unwrap();

      console.log("Response:", response);

      if (response) {
        toast.success("Organisation added successfully!");
        // Clear the form data after submission
        setFormData({
          name: "",
          email: "",
          logo: null,
          profile_image: null,
          hero_image: null,
          primary_mobile: "",
          other_contact: "",
          contact_person: "",
          contact_person_designation: "",
          website: "",
          license_no: "",
          license_image: null,
          is_removed: false,
        });
        toggleModal();
      }
    } catch (error: any) {
      if (error?.data?.email?.[0]) {
        toast.error(error.data.email[0]);
      } else {
        toast.error("Failed to add organisation. Please try again.");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg">
      <ModalHeader toggle={toggleModal}>Add New Organisation</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            {/* 1st colunm  */}
            <Col md={6} xs={12}>
              <FormGroup>
                <Label for="name">
                  Organisation Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter organisation name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="primary_mobile">
                  Primary Mobile<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="primary_mobile"
                  name="primary_mobile"
                  value={formData.primary_mobile}
                  onChange={handleChange}
                  placeholder="Enter primary mobile number"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="other_contact">Other Contact</Label>
                <Input
                  type="text"
                  id="other_contact"
                  name="other_contact"
                  value={formData.other_contact}
                  onChange={handleChange}
                  placeholder="Enter other contact person's phone"
                />
              </FormGroup>
              <FormGroup>
                <Label for="logo">Logo</Label>
                <Input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={(e) => handleFileChange(e, "logo")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="profile_image">Profile Image</Label>
                <Input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  onChange={(e) => handleFileChange(e, "profile_image")}
                />
              </FormGroup>{" "}
              <FormGroup>
                <Label for="license_no">License Number</Label>
                <Input
                  type="text"
                  id="license_no"
                  name="license_no"
                  value={formData.license_no}
                  onChange={handleChange}
                  placeholder="Enter license number"
                />
              </FormGroup>
            </Col>
            {/* 2nd Column  */}
            <Col md={6} xs={12}>
              <FormGroup>
                <Label for="email">
                  Email<span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="website">
                  Website{" "}
                  <span style={{ fontSize: "0.7rem", color: "#f39c12" }}>
                    (Example: https://yourdomain.com)
                  </span>
                </Label>
                <Input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                />
              </FormGroup>
              <FormGroup>
                <Label for="contact_person">Contact Person</Label>
                <Input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Enter contact person's name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="contact_person_designation">
                  Contact Person Designation
                </Label>
                <Input
                  type="text"
                  id="contact_person_designation"
                  name="contact_person_designation"
                  value={formData.contact_person_designation}
                  onChange={handleChange}
                  placeholder="Enter contact person's designation"
                />
              </FormGroup>
              <FormGroup>
                <Label for="hero_image">Hero Image</Label>
                <Input
                  type="file"
                  id="hero_image"
                  name="hero_image"
                  onChange={(e) => handleFileChange(e, "hero_image")}
                />
              </FormGroup>
              <FormGroup>
                <Label for="license_image">License Image</Label>
                <Input
                  type="file"
                  id="license_image"
                  name="license_image"
                  onChange={(e) => handleFileChange(e, "license_image")}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {isLoading ? "Saving..." : "Save Organisation"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddOrganisationModal;
