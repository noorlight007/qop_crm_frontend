import { useUpdateAdviserDetailsMutation } from "@/Redux/Reducers/CommonComponents/CommonUsers/AdviserDetailsApi";
import {
  AdviserInfoProps,
  UpdateAdviserModalProps,
} from "@/Types/CommonComponents/Directors/AdviserTypes";
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

const UpdateAdviserModal: React.FC<UpdateAdviserModalProps> = ({
  isOpen,
  toggle,
  onSave,
  selectedAdviser,
}) => {
  const [adviserData, setAdviserData] =
    useState<Partial<AdviserInfoProps>>(selectedAdviser);
  const [isModified, setIsModified] = useState(false);
  const [updateAdviserDetails, { isLoading }] =
    useUpdateAdviserDetailsMutation();

  useEffect(() => {
    setAdviserData(selectedAdviser);
    setIsModified(false);
  }, [selectedAdviser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setAdviserData((prev) => {
      const updatedData = JSON.parse(JSON.stringify(prev));
      let current: any = updatedData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updatedData as Partial<AdviserInfoProps>;
    });
    setIsModified(true); // Set the form as modified
  };

  const handleUpdateAdviser = async (
    adviserData: Partial<AdviserInfoProps>
  ) => {
    try {
      if (adviserData.alias) {
        // Only include email if it has changed
        let payload: Partial<AdviserInfoProps> = { ...adviserData };

        // If joining_date is empty string, send null
        if (payload.joining_date === "") {
          payload.joining_date = null as unknown as any;
        }
        const originalEmail = selectedAdviser?.user?.email || "";
        const updatedEmail = adviserData?.user?.email || "";
        if (originalEmail === updatedEmail) {
          // Remove email from payload if not changed
          if (payload.user) {
            const { email, ...restUser } = payload.user;
            payload.user = restUser;
          }
        }
        const result = await updateAdviserDetails({
          payload,
          adviserAlias: adviserData.alias,
        });

        if (result.data) {
          toast.success("Adviser update successfully.");
        } else if ("error" in result) {
          const errorMessage =
            (result.error as any)?.data?.user?.email?.[0] ||
            (result.error as any)?.data?.user?.nid?.[0] ||
            (result.error as any)?.data?.detail ||
            "Invalid Request...";
          // Custom error for duplicate email
          if (
            typeof errorMessage === "string" &&
            errorMessage.toLowerCase().includes("email") &&
            errorMessage.toLowerCase().includes("exist")
          ) {
            toast.error("User with this email already exists.");
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Invalid Request...");
        }
      }
    } catch (error) {
      toast.error("Failed to update adviser.");
      console.error("Error saving advisor:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdateAdviser(adviserData); // Pass the updated data to the server
    onSave(adviserData); // Pass the updated data to the parent component
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Adviser</span>
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
                  value={adviserData?.user?.title || ""}
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
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="firstName">First Name*</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="user.first_name"
                  placeholder="First Name"
                  value={adviserData.user?.first_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="middleName">Middle Name(s)</Label>
                <Input
                  type="text"
                  id="middleName"
                  name="user.middle_name"
                  placeholder="Middle Name(s)"
                  value={adviserData.user?.middle_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="lastName">Last Name*</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="user.last_name"
                  placeholder="Last Name"
                  value={adviserData.user?.last_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6" xs="12">
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="user.email"
                  placeholder="Email"
                  value={adviserData.user?.email || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="number"
                  id="phone"
                  name="user.phone"
                  placeholder="Phone"
                  value={adviserData.user?.phone || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="joining_date">Joining Date</Label>
                <Input
                  type="date"
                  id="joining_date"
                  name="joining_date"
                  placeholder="Joining Date"
                  value={adviserData.joining_date || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            {/* <Col md={6} xs={6}>
              <FormGroup>
                <Label for="profile_image">Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  id="profile_image"
                  name="user.profile_image"
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
export default UpdateAdviserModal;
