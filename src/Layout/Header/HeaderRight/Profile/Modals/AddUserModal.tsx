import { useAddUserMutation } from "@/Redux/Reducers/AddUser/AddUserApi";
import { useSession } from "next-auth/react";
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
  Spinner,
} from "reactstrap";

interface AddUserModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, toggle }) => {
  const { data: session } = useSession();
  // RTK hooks
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();

  const [formData, setFormData] = useState({
    userType: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profileImage: null,
  });

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }
    const formPayload = new FormData();
    formPayload.append("user_type", formData.userType);
    formPayload.append("title", formData.title);
    formPayload.append("first_name", formData.firstName);
    formPayload.append("middle_name", formData.middleName);
    formPayload.append("last_name", formData.lastName);
    formPayload.append("email", formData.email);
    formPayload.append("password", formData.password);
    formPayload.append("phone", formData.phone);
    if (formData.profileImage) {
      formPayload.append("profile_image", formData.profileImage);
    }

    try {
      const result = await addUser(formPayload);

      if (result.data) {
        toast.success("User added successfully!");
        setFormData({
          userType: "",
          title: "",
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          profileImage: null,
        });
        toggle();
      } else if ("error" in result) {
        const errorMessage =
          (result.error as any)?.data?.email?.[0] || "Invalid Request...";
        toast.error(errorMessage);
      } else {
        toast.error("Invalid Request...");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.email?.[0] ||
        "An error occurred. Please try again.";
      toast.error(errorMessage);
      console.error("Error creating user:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prevData) => ({
        ...prevData,
        [name]: files && files.length > 0 ? files[0] : null,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add User</span>
      </ModalHeader>
      <Form onSubmit={handleSaveUser}>
        <ModalBody>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="userType">
                  User Type<span className="text-danger">*</span>
                </Label>
                <Input
                  id="userType"
                  name="userType"
                  type="select"
                  value={formData.userType || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  {session?.user?.user_type === "NETWORK_ADMIN" && (
                    <>
                      {/* <option value="LEAD">Lead</option>
                      <option value="CLIENT">Client</option>
                      <option value="ADVISOR">Advisor</option>
                      <option value="INTRODUCER">Introducer</option>
                      <option value="SERVICE_HOLDER">Service Holder</option>
                      <option value="JOINT_USER">Joint User</option>
                      <option value="NETWORK_CEO">Network CEO</option>
                      <option value="NETWORK_COO">Network COO</option>
                      <option value="NETWORK_SYSTEM_DEVELOPER">
                        Network System Developer
                      </option>
                      <option value="NETWORK_COMPLIANCE_MANAGER">
                        Network Compliance Manager
                      </option>
                      <option value="NETWORK_COMPLIANCE_ASSISTANT">
                        Network Compliance Assistant
                      </option>
                      <option value="NETWORK_PRINCIPAL_ADVISER">
                        Network Principal Adviser
                      </option> 
                      <option value="NETWORK_ADMIN">Network Admin</option>*/}
                      <option value="NETWORK_ADVISER">Network Adviser</option>
                      {/* <option value="ORGANIZATION_CEO">Organization CEO</option>
                      <option value="ORGANIZATION_COO">Organization COO</option>
                      <option value="ORGANIZATION_SYSTEM_DEVELOPER">
                        Organization System Developer
                      </option>
                      <option value="ORGANIZATION_COMPLIANCE_MANAGER">
                        Organization Compliance Manager
                      </option>
                      <option value="ORGANIZATION_COMPLIANCE_ASSISTANT">
                        Organization Compliance Assistant
                      </option>
                      <option value="ORGANIZATION_PRINCIPAL_ADVISER">
                        Organization Principal Adviser
                      </option> */}
                      <option value="ORGANIZATION_ADVISER">
                        Organization Adviser
                      </option>
                      <option value="ORGANIZATION_ADMIN">
                        Organization Admin
                      </option>
                      <option value="ORGANIZATION_SUPPORT">
                        Organization Support Staff
                      </option>
                    </>
                  )}
                  {session?.user?.user_type === "ORGANIZATION_ADMIN" && (
                    <>
                      <option value="ORGANIZATION_ADVISER">
                        Organization Adviser
                      </option>
                      <option value="ORGANIZATION_SUPPORT">
                        Organization Support Staff
                      </option>
                      {/* <option value="ORGANIZATION_CEO">Organization CEO</option>
                      <option value="ORGANIZATION_COO">Organization COO</option>
                      <option value="ORGANIZATION_SYSTEM_DEVELOPER">
                        Organization System Developer
                      </option>
                      <option value="ORGANIZATION_COMPLIANCE_MANAGER">
                        Organization Compliance Manager
                      </option>
                      <option value="ORGANIZATION_COMPLIANCE_ASSISTANT">
                        Organization Compliance Assistant
                      </option>
                      <option value="ORGANIZATION_PRINCIPAL_ADVISER">
                        Organization Principal Adviser
                      </option> */}
                    </>
                  )}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="title">
                  Title<span className="text-danger">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="select"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="MR">Mr.</option>
                  <option value="MRS">Mrs.</option>
                  <option value="MS">Ms.</option>
                  <option value="DR">Dr.</option>
                  <option value="MISS">Miss.</option>
                  <option value="MADAM">Madam.</option>
                  <option value="MAIDEN">Maiden.</option>
                  <option value="PROFESSOR">Professor.</option>
                  <option value="DOCTOR">Doctor.</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="firstName">
                  First Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="lastName">
                  Last Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">
                  Email<span className="text-danger">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="password">
                  Password<span className="text-danger">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="confirmPassword">
                  Confirm Password<span className="text-danger">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword || ""}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="profileImage">Profile Image</Label>
                <Input
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  type="file"
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <ModalFooter>
            <Button color="secondary" onClick={toggle} disabled={isAdding}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isAdding}>
              Add User
              {isAdding && <Spinner size="sm" />}
            </Button>
          </ModalFooter>
        </ModalBody>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
