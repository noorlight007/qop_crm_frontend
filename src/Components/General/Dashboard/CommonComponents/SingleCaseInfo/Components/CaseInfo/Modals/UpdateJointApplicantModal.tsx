import { useUpdateJointApplicantInfoMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantApi";
import { UpdateJointApplicantModalProps } from "@/Types/CommonComponents/SingleCaseInfo/JointApplicant/JointApplicantTypes";
import { isEqual } from "lodash";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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

const UpdateJointApplicantModal: React.FC<UpdateJointApplicantModalProps> = ({
  isOpen,
  toggle,
  user,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [updateJointApplicantInfo, { isLoading }] =
    useUpdateJointApplicantInfoMutation();

  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
    relationship: "",
    other_relationship: "",
    notes: "",
  });

  // Populate formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        title: user?.joint_user_details?.title || "",
        first_name: user?.joint_user_details?.first_name || "",
        middle_name: user?.joint_user_details?.middle_name || "",
        last_name: user?.joint_user_details?.last_name || "",
        email: user?.joint_user_details?.email || "",
        phone: user?.joint_user_details?.phone || "",
        relationship: user?.relationship || "",
        other_relationship: user?.other_relationship || "",
        notes: user?.notes || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Determine if the email has changed
    const originalEmail = user?.joint_user_details?.email || "";
    const hasEmailChanged = formData.email !== originalEmail;

    // Prepare the payload, conditionally including the email field
    const payload = {
      case_alias: casealias,
      userAlias: user.alias,
      updatedJointuserInfo: {
        joint_user: {
          title: formData.title,
          first_name: formData.first_name,
          middle_name: formData.middle_name,
          last_name: formData.last_name,
          phone: formData.phone,

          ...(hasEmailChanged && { email: formData.email }), // Only include email if it has changed
        },
        relationship: formData.relationship,
        other_relationship: formData.other_relationship,
        notes: formData.notes,
      },
    };

    const res = await updateJointApplicantInfo(payload);

    if (res.data) {
      toast.success("Applicant updated successfully!");
      toggle();
      console.log("Update successful:", res.data);
    } else if ("error" in res) {
      const errorMessage =
        (res.error as any)?.data?.joint_user?.email?.[0] ||
        "Failed to update user information.";
      toast.error(errorMessage);
    }
  };

  // Compare current data with the original data
  const hasChanges = !isEqual(formData, {
    title: user?.joint_user_details?.title || "",
    first_name: user?.joint_user_details?.first_name || "",
    middle_name: user?.joint_user_details?.middle_name || "",
    last_name: user?.joint_user_details?.last_name || "",
    email: user?.joint_user_details?.email || "",
    phone: user?.joint_user_details?.phone || "",
    relationship: user?.relationship || "",
    notes: user?.notes || "",
  });

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Joint Applicant</span>
      </ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col xl={6} md={12}>
              <FormGroup>
                <Label for="title">
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
            <Col xl={6} md={12}>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xl={6} md={12}>
              <FormGroup>
                <Label for="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>

            <Col xl={6} md={12}>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xl={6} md={12}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col xl={6} md={12}>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="number"
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
            <Col xl={6} md={12}>
              <FormGroup>
                <Label for="notes">Note</Label>
                <Input
                  type="textarea"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>{" "}
        <Button
          color="primary"
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateJointApplicantModal;
