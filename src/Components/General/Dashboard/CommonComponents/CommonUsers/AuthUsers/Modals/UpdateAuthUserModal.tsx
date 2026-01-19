import { useUpdateAuthUserDetailsMutation } from "@/Redux/Reducers/CommonComponents/CommonUsers/AuthUsersApi";
import {
  AuthUser,
  UpdateAuthUserModalProps,
} from "@/Types/CommonComponents/CommonUsers/AuthUsersTypes";
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

const UpdateAuthUserModal: React.FC<UpdateAuthUserModalProps> = ({
  isOpen,
  toggle,
  selectedAuthUser,
}) => {
  const [authUserData, setAuthUserData] =
    useState<Partial<AuthUser>>(selectedAuthUser);
  const [isModified, setIsModified] = useState(false);
  const [updateAuthUserDetails, { isLoading }] =
    useUpdateAuthUserDetailsMutation();

  useEffect(() => {
    setAuthUserData(selectedAuthUser);
    setIsModified(false);
  }, [selectedAuthUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAuthUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(true);
  };

  const handleUpdateAuthUser = async (
    e: React.FormEvent<HTMLFormElement>,
    authUserData: Partial<AuthUser>
  ) => {
    e.preventDefault();
    try {
      if (authUserData.alias) {
        let payload: Partial<AuthUser> = { ...authUserData };

        // If joining_date is empty string, send null
        if (payload.joining_date === "") {
          payload.joining_date = null as unknown as any;
        }

        const result = await updateAuthUserDetails({
          payload,
          userAlias: authUserData.alias,
        });

        if (result.data) {
          toast.success("Admin updated successfully.");
          toggle();
        } else if ("error" in result) {
          const errorMessage =
            (result.error as any)?.data?.email?.[0] ||
            (result.error as any)?.data?.detail ||
            "Invalid Request...";
          toast.error(errorMessage);
        } else {
          toast.error("Invalid Request...");
        }
      }
    } catch (error) {
      toast.error("Failed to update admin.");
      console.error("Error saving admin:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Info</span>
      </ModalHeader>
      <Form onSubmit={(e) => handleUpdateAuthUser(e, authUserData)}>
        <ModalBody>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for="title">
                  Title<span className="text-danger">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="select"
                  value={authUserData?.title || ""}
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
                <Label for="firstName">
                  First Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  name="first_name"
                  placeholder="First Name"
                  value={authUserData?.first_name || ""}
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
                  name="middle_name"
                  placeholder="Middle Name(s)"
                  value={authUserData?.middle_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="lastName">
                  Last Name<span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  name="last_name"
                  placeholder="Last Name"
                  value={authUserData?.last_name || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md="6" xs="12">
              <FormGroup>
                <Label for="email">
                  Email<span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={authUserData?.email || ""}
                  onChange={handleChange}
                  className="mb-2"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="number"
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  value={authUserData?.phone || ""}
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
                  value={authUserData?.joining_date || ""}
                  onChange={handleChange}
                  className="mb-2"
                />
              </FormGroup>
            </Col>
            <Col md={6} xs={6}>
              <FormGroup>
                <Label for="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  type="select"
                  value={authUserData?.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Input>
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
export default UpdateAuthUserModal;
