import { useAddJointUserInfoMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/JointUser/JointUserDetailsApi";
import { AddJointUserModalProps } from "@/Types/CommonComponents/SingleCaseInfo/JointUser/JointUserTypes";
import { useParams } from "next/navigation";
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

const AddJointUserModal: React.FC<AddJointUserModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const params = useParams();
  const { casealias } = params;
  const [addJointUserInfo, { isLoading: isAddingJointUser }] =
    useAddJointUserInfoMutation(undefined);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    relationship: "",
    other_relationship: "",
    profileImage: "",
    notes: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      joint_user: {
        title: formData.title,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      relationship: formData.relationship,
      notes: formData.notes,
    };
    const res = await addJointUserInfo({
      case_alias: casealias,
      jointuserInfo: payload,
    });
    if (res.data) {
      toast.success("Joint user added successfully!");
      // Reset form data after successful submission
      setFormData({
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        relationship: "",
        other_relationship: "",
        profileImage: "",
        notes: "",
      });
      toggle();
    } else if ("error" in res) {
      const errorMessage =
        (res.error as any)?.data?.joint_user?.email?.[0] ||
        "Failed to add joint user.";
      toast.error(errorMessage);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Joint Applicant</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="title" className="form-label">
                  Title<span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="MR">Mr</option>
                  <option value="MRS">Mrs</option>
                  <option value="MS">Ms</option>
                  <option value="DR">Dr</option>
                  <option value="MISS">Miss</option>
                  <option value="MADAM">Madam</option>
                  <option value="MAIDEN">Maiden</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="DOCTOR">Doctor</option>
                </Input>
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="first_name" className="form-label">
                  First Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="first_name"
                  name="firstName"
                  required
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="middle_name" className="form-label">
                  Middle Name
                </Label>
                <Input
                  type="text"
                  id="middle_name"
                  name="middleName"
                  placeholder="Enter middle name"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="last_name" className="form-label">
                  Last Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="last_name"
                  name="lastName"
                  required
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>{" "}
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="email" className="form-label">
                  Email<span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="phone" className="form-label">
                  Phone<span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  id="phone"
                  name="phone"
                  required
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="relationship" className="small">
                  Relationship
                </Label>
                <Input
                  type="select"
                  name="relationship"
                  id="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                >
                  <option value="">Select...</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="SIBLING">Sibling</option>
                  <option value="OTHER">Other</option>
                </Input>
              </FormGroup>
            </Col>
            {formData.relationship === "OTHER" && (
              <Col xs={12} md={6}>
                <FormGroup>
                  <Label for="other_relationship" className="small">
                    Other Relationship
                  </Label>
                  <Input
                    type="text"
                    name="other_relationship"
                    id="other_relationship"
                    value={formData.other_relationship}
                    onChange={handleInputChange}
                    placeholder="Specify other relationship"
                  />
                </FormGroup>
              </Col>
            )}
            <Col xs={12} md={6}>
              <FormGroup>
                <Label for="notes" className="form-label">
                  Notes
                </Label>
                <Input
                  type="textarea"
                  id="notes"
                  name="notes"
                  placeholder="Enter notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} block>
            Cancel
          </Button>
          <Button color="primary" block={isAddingJointUser}>
            {isAddingJointUser ? "Saving..." : "Save Joint Applicant"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddJointUserModal;
