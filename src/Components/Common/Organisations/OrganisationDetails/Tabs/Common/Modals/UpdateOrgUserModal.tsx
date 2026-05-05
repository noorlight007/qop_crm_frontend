"use client";

import { useUpdateOrgMemberMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgUserListApi";
import { OrgAdminInfo } from "@/Types/Common/Organisations/OrgAdminTypes";
import { OrgAdviserInfo } from "@/Types/Common/Organisations/OrgAdviserType";
import { OrgIntroducerInfo } from "@/Types/Common/Organisations/OrgIntroducerTypes";
import React, { useEffect, useMemo, useState } from "react";
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

type OrgUserRole = "ADMIN" | "INTRODUCER" | "ADVISER";

type OrgUserItem = OrgAdminInfo | OrgIntroducerInfo | OrgAdviserInfo;

type OrgUserForm = Record<string, any>;

export type UpdateOrgUserModalProps = {
  isOpen: boolean;
  toggle: () => void;
  organisationslug: string;
  role: OrgUserRole;
  selectedUser?: Partial<OrgUserItem>;
};

const UpdateOrgUserModal: React.FC<UpdateOrgUserModalProps> = ({
  isOpen,
  toggle,
  organisationslug,
  role,
  selectedUser,
}) => {
  const [formData, setFormData] = useState<OrgUserForm>({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    name: "",
    email: "",
    phone: "",
    gender: "",
    joining_date: "",
    note: "",
  });
  const [originalData, setOriginalData] = useState<OrgUserForm>({});
  const [isModified, setIsModified] = useState(false);

  const [updateMember, { isLoading }] = useUpdateOrgMemberMutation();

  useEffect(() => {
    setFormData({
      title: (selectedUser as any)?.title ?? "",
      first_name: (selectedUser as any)?.first_name ?? "",
      middle_name: (selectedUser as any)?.middle_name ?? "",
      last_name: (selectedUser as any)?.last_name ?? "",
      name: (selectedUser as any)?.name ?? "",
      email: (selectedUser as any)?.email ?? "",
      phone: (selectedUser as any)?.phone ?? "",
      gender: (selectedUser as any)?.gender ?? "",
      joining_date: (selectedUser as any)?.joining_date ?? "",
      note: (selectedUser as any)?.note ?? "",
    });
    setOriginalData({
      title: (selectedUser as any)?.title ?? "",
      first_name: (selectedUser as any)?.first_name ?? "",
      middle_name: (selectedUser as any)?.middle_name ?? "",
      last_name: (selectedUser as any)?.last_name ?? "",
      name: (selectedUser as any)?.name ?? "",
      email: (selectedUser as any)?.email ?? "",
      phone: (selectedUser as any)?.phone ?? "",
      gender: (selectedUser as any)?.gender ?? "",
      joining_date: (selectedUser as any)?.joining_date ?? "",
      note: (selectedUser as any)?.note ?? "",
    });
    setIsModified(false);
  }, [selectedUser]);

  const title = useMemo(() => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "INTRODUCER":
        return "Introducer";
      case "ADVISER":
        return "Adviser";
      default:
        return "User";
    }
  }, [role]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsModified(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userAlias = formData.alias;
    if (!userAlias) {
      toast.error("User alias not found.");
      return;
    }

    const payload: Record<string, any> = {};

    const fieldsToCheck: string[] = [
      "title",
      "first_name",
      "middle_name",
      "last_name",
      "name",
      "email",
      "phone",
      "gender",
      "joining_date",
      "note",
    ];

    if (role === "INTRODUCER") {
      fieldsToCheck.push("company_name", "company_address");
    }

    fieldsToCheck.forEach((field) => {
      const currentValue = (formData as any)[field];
      const originalValue = (originalData as any)[field];
      if (currentValue !== originalValue) payload[field] = currentValue;
    });

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save.");
      return;
    }

    try {
      const result = await updateMember({
        organisationslug,
        user_alias: userAlias,
        payload,
      });

      if ((result as any)?.data) {
        toast.success(`${title} updated successfully.`);
        toggle();
      } else if ("error" in (result as any)) {
        toast.error("Failed to update user.");
      } else {
        toast.error("Invalid request.");
      }
    } catch (error) {
      console.error("Failed to update user", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Update Info</span>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
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
                  value={(formData as any)?.title ?? ""}
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
                <Label for="first_name">
                  First Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={(formData as any)?.first_name ?? ""}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label for="middle_name">Middle Name(s)</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  type="text"
                  value={(formData as any)?.middle_name ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label for="last_name">
                  Last Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={(formData as any)?.last_name ?? ""}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={(formData as any)?.email ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={(formData as any)?.phone ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label for="joining_date">Joining Date</Label>
                <Input
                  id="joining_date"
                  name="joining_date"
                  type="text"
                  value={(formData as any)?.joining_date ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label for="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  type="select"
                  value={(formData as any)?.gender ?? ""}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Input>
              </FormGroup>
            </Col>

            <Col sm="12">
              <FormGroup>
                <Label for="note">Note</Label>
                <Input
                  id="note"
                  name="note"
                  type="textarea"
                  rows={3}
                  value={(formData as any)?.note ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={isLoading || !isModified}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateOrgUserModal;
