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
  const [formData, setFormData] = useState<Partial<OrgUserItem>>({});
  const [originalData, setOriginalData] = useState<Partial<OrgUserItem>>({});
  const [isModified, setIsModified] = useState(false);

  const [updateMember, { isLoading }] = useUpdateOrgMemberMutation();

  useEffect(() => {
    setFormData(selectedUser ?? {});
    setOriginalData(selectedUser ?? {});
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
    const finalValue = name === "is_active" ? value === "true" : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
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
      "name",
      "email",
      "phone",
      "gender",
      "joining_date",
      "is_active",
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
                <Label for="name">
                  Name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={(formData as any)?.name ?? ""}
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
                  type="text"
                  value={(formData as any)?.gender ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md="6" sm="12">
              <FormGroup>
                <Label for="is_active">Status</Label>
                <Input
                  id="is_active"
                  name="is_active"
                  type="select"
                  value={
                    typeof (formData as any)?.is_active === "boolean"
                      ? String((formData as any).is_active)
                      : "false"
                  }
                  onChange={handleChange}
                >
                  <option value="true">Approved</option>
                  <option value="false">Pending</option>
                </Input>
              </FormGroup>
            </Col>

            {role === "INTRODUCER" && (
              <>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={(formData as any)?.company_name ?? ""}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for="company_address">Company Address</Label>
                    <Input
                      id="company_address"
                      name="company_address"
                      type="text"
                      value={(formData as any)?.company_address ?? ""}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </>
            )}

            <Col md="12" sm="12">
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
