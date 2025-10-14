import { useUpdateLeadDetailsMutation } from "@/Redux/Reducers/CommonComponents/Directors/LeadDetalisApi";
import {
  LeadsInfo,
  UpdateLeadModalProps,
} from "@/Types/CommonComponents/Directors/LeadTypes";
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

const UpdateLeadModal: React.FC<UpdateLeadModalProps> = ({
  isOpen,
  toggle,
  onSave,
  selectedLead,
}) => {
  const [leadData, setLeadData] = useState<Partial<LeadsInfo>>(selectedLead);
  const [isModified, setIsModified] = useState(false);

  const [updateLeadDetails, { isLoading }] = useUpdateLeadDetailsMutation();

  useEffect(() => {
    setLeadData(selectedLead);
    setIsModified(false);
  }, [selectedLead]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setLeadData((prev: any) => {
      const updatedData = JSON.parse(JSON.stringify(prev));
      let current: any = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updatedData as Partial<LeadsInfo>;
    });
    setIsModified(true); // Set the form as modified
  };

  const handleUpdateLead = async (leadData: Partial<LeadsInfo>) => {
    try {
      if (leadData.alias) {
        const result = await updateLeadDetails({
          payload: leadData,
          leadAlias: leadData.alias,
        });

        if (result.data) {
          toast.success("Lead update successfully.");
        } else if ("error" in result) {
          const errorMessage =
            (result.error as any)?.data?.user?.email?.[0] ||
            (result.error as any)?.data?.user?.nid?.[0] ||
            "Invalid Request...";
          toast.error(errorMessage);
        } else {
          toast.error("Invalid Request...");
        }
      }
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateLead(leadData); // Pass the updated data to the server
    onSave(leadData); // Pass the updated data to the parent component
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Lead Info</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="title">Title*</Label>
                <Input
                  id="title"
                  name="user.title"
                  type="select"
                  value={leadData?.user?.title || ""}
                  onChange={handleChange}
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
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="firstName">First Name*</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="user.first_name"
                  placeholder="First Name"
                  value={leadData?.user?.first_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="middleName">Middle Name</Label>
                <Input
                  type="text"
                  id="middleName"
                  name="user.middle_name"
                  placeholder="Middle Name"
                  value={leadData?.user?.middle_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="lastName">Last Name*</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="user.last_name"
                  placeholder="Last Name"
                  value={leadData?.user?.last_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="dob">Official Email</Label>
                <Input
                  type="email"
                  id="official_email"
                  name="official_email"
                  placeholder="Official Email"
                  value={leadData?.official_email || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="official_phone">Official Phone</Label>
                <Input
                  type="number"
                  id="official_phone"
                  name="official_phone"
                  placeholder="Official Phone"
                  value={leadData?.official_phone || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            {/* <Col md="6" sm="12">
              <FormGroup>
                <Label for="user_type">User Type</Label>
                <Input
                  type="select"
                  id="user_type"
                  name="user.user_type"
                  placeholder="User Type"
                  value={leadData?.user?.user_type || ""}
                  onChange={handleChange}
                  className="mb-2 pointer-event"
                >
                  <option value="">Select...</option>
                  <option value="LEAD">LEAD</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="ADVISOR">ADVISOR</option>
                  <option value="INTRODUCER">INTRODUCER</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="role">Role</Label>
                <Input
                  type="select"
                  id="role"
                  name="role"
                  placeholder="Role"
                  value={leadData?.role || ""}
                  onChange={handleChange}
                  className="mb-2 pointer-event"
                >
                  <option value="">Select..</option>
                  <option value="LEAD">LEAD</option>
                  <option value="CLIENT">CLIENT</option>
                  <option value="ADVISOR">ADVISOR</option>
                  <option value="INTRODUCER">INTRODUCER</option>
                </Input>
              </FormGroup>
            </Col> */}
            {/* <Col sm="12">
              <FormGroup>
                <Label for="profile_image">Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  id="profile_image"
                  name="profile_image"
                  placeholder="Image"
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col> */}
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={!isModified || isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
export default UpdateLeadModal;
