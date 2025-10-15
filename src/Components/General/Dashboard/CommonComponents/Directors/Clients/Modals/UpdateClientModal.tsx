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
                <Label for="email">Email*</Label>
                <Input
                  type="email"
                  id="email"
                  name="user.email"
                  placeholder="Email"
                  required
                  value={clientData?.user?.email || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="number"
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  value={clientData?.user?.phone || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="reason_for_enquiry">Reason for Enquiry</Label>
                <Input
                  id="reason_for_enquiry"
                  name="reason_for_enquiry"
                  type="text"
                  value={clientData.reason_for_enquiry || ""}
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
