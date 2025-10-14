import { useUpdateClientDetailsMutation } from "@/Redux/Reducers/CommonComponents/Directors/ClientDetailsApi";
import {
  ClientInfoProps,
  UpdateClientModalProps,
} from "@/Types/CommonComponents/Directors/ClientTypes";
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

const UpdateClientModal: React.FC<UpdateClientModalProps> = ({
  isOpen,
  toggle,
  onSave,
  selectedClient,
}) => {
  const [clientData, setClientData] =
    useState<Partial<ClientInfoProps>>(selectedClient);
  const [isModified, setIsModified] = useState(false);

  const [updateClientDetails, { isLoading }] = useUpdateClientDetailsMutation();

  useEffect(() => {
    setClientData(selectedClient);
    setIsModified(false);
  }, [selectedClient]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setClientData((prev) => {
      const updatedData = JSON.parse(JSON.stringify(prev));
      let current = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updatedData;
    });
    setIsModified(true);
  };

  const handleUpdateClient = async (clientData: Partial<ClientInfoProps>) => {
    try {
      if (clientData.alias) {
        const result = await updateClientDetails({
          payload: clientData,
          clientAlias: clientData.alias,
        });
        if (result.data) {
          toast.success("Client update successfully.");
        } else if ("error" in result) {
          const errorMessage =
            (result.error as any)?.data?.user?.email?.[0] ||
            (result.error as any)?.data?.user?.nid?.[0] ||
            "Invalid Request...";
          toast.error(errorMessage);
        } else {
          toast.error("Failed to update client.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating the client.");
      console.error("Error saving client:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateClient(clientData); // Pass the updated data to the server
    onSave(clientData); // Pass the updated data to the parent component
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Client Info</span>
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
                  value={clientData?.user?.title || ""}
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
                  value={clientData.user?.first_name || ""}
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
                  value={clientData.user?.middle_name || ""}
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
                  value={clientData.user?.last_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="official_email">Official Email</Label>
                <Input
                  type="email"
                  id="official_email"
                  name="official_email"
                  placeholder="Official Email"
                  value={clientData.official_email || ""}
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
                  value={clientData.official_phone || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            {/* <Col md={6} xs={12}>
              <FormGroup>
                <Label for="user_type">User Type</Label>
                <Input
                  type="select"
                  id="user_type"
                  name="user.user_type"
                  placeholder="User Type"
                  value={clientData.user?.user_type || ""}
                  onChange={handleChange}
                  className="mb-2 pointer-event"
                >
                  <option value="">Select...</option>
                  <option value="LEAD">Lead</option>
                  <option value="CLIENT">Client</option>
                  <option value="ADVISOR">Adviser</option>
                  <option value="INTRODUCER">Introducer</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={6} xs={12}>
              <FormGroup>
                <Label for="role">Role</Label>
                <Input
                  type="select"
                  id="role"
                  name="role"
                  placeholder="Role"
                  value={clientData.role || ""}
                  onChange={handleChange}
                  className="mb-2 pointer-event"
                >
                  <option value="">Select...</option>
                  <option value="LEAD">Lead</option>
                  <option value="CLIENT">Client</option>
                  <option value="ADVISOR">Adviser</option>
                  <option value="INTRODUCER">Introducer</option>
                </Input>
              </FormGroup>
            </Col>
            <Col sm="12">
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
            <Col md={6}>
              <FormGroup>
                <Label for="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  value={clientData.dob}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="present_address">Present Address</Label>
                <Input
                  id="present_address"
                  name="present_address"
                  type="text"
                  value={clientData.present_address}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="permanent_address">Permanent Address</Label>
                <Input
                  id="permanent_address"
                  name="permanent_address"
                  type="text"
                  value={clientData.permanent_address}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
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
export default UpdateClientModal;
