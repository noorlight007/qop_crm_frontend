import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Network/Organisations/SingleOrganisation/SingleOrganisationApi";
import { UpdateOrganisationModalProps } from "@/Types/Network/OrganisationsTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
} from "reactstrap";

const UpdateOrganisationModal: React.FC<UpdateOrganisationModalProps> = ({
  isOpen,
  toggle,
  slug,
  organisationData,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    primary_mobile: "",
    other_contact: "",
    website: "",
    contact_person: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [oldName, setOldName] = useState("");
  // Rtk hooks
  const [updateOrganisation, { isLoading }] = useUpdateOrganisationMutation();

  // Set initial form values when modal opens
  useEffect(() => {
    if (organisationData && isOpen) {
      setFormData({
        name: organisationData.organization.name || "",
        email: organisationData.organization.email || "",
        primary_mobile: organisationData.organization.primary_mobile || "",
        other_contact: organisationData.organization.other_contact || "",
        website: organisationData.organization.website || "",
        contact_person: organisationData.organization.contact_person || "",
      });
      setOldName(organisationData.name || "");
    }
  }, [organisationData, isOpen]);

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "profile_image") {
        setProfileImage(files[0]);
      } else if (name === "logo") {
        setLogo(files[0]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      // Append files if selected
      if (profileImage) {
        formDataToSend.append("profile_image", profileImage);
      }
      if (logo) {
        formDataToSend.append("logo", logo);
      }
      // Use RTK Query mutation
      const response = await updateOrganisation({
        slug,
        payload: formDataToSend,
      }).unwrap();
      if (response) {
        toast.success("Organisation updated successfully!");
        // Redirect if name changed
        if (formData.name !== oldName) {
          router.push("/dashboard/network/organisations");
          toast.warning(
            "Due to the name change, redirected to the Organisations page."
          );
        } else {
          toggle();
        }
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
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h3 className="text-primary">Update Organisation</h3>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="name">Organisation Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="primary_mobile">Primary Phone</Label>
                <Input
                  type="text"
                  id="primary_mobile"
                  name="primary_mobile"
                  value={formData.primary_mobile}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
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
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="contact_person">Contact Person</Label>
                <Input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="other_contact">Other Contact</Label>
                <Input
                  type="text"
                  id="other_contact"
                  name="other_contact"
                  value={formData.other_contact}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {/* Logo Upload */}
            <Col md="6">
              <FormGroup>
                <Label for="logo">Logo</Label>
                <Input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {organisationData?.logo ? (
                  <div className="d-flex justify-content-center  mt-2">
                    <Image
                      src={organisationData.logo}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-circle w-25 h-25 border-1 border-success"
                    />
                  </div>
                ) : (
                  <div className="text-center mt-2 fw-medium opacity-50">
                    <h6>Image not avaiable</h6>
                  </div>
                )}
              </FormGroup>
            </Col>
            {/* Profile Image Upload */}
            <Col md="6">
              <FormGroup>
                <Label for="profile_image">Banner Image</Label>
                <Input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {organisationData?.profile_image ? (
                  <div className="d-flex justify-content-center mt-2">
                    <Image
                      src={organisationData.profile_image}
                      alt="Profile"
                      width={100}
                      height={80}
                      className="rounded-2 w-50 border border-success"
                    />
                  </div>
                ) : (
                  <div className="text-center mt-2 fw-medium opacity-50">
                    <h6>Image not available</h6>
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateOrganisationModal;
