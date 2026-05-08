"use client";
import { useUpdateOrgMemberMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/OrgMembersApi";
import {
  OrgMemberType,
  UpdateOrgMemberModalProps,
} from "@/Types/Common/Organisations/OrgMembersTypes";
import formatChoiceFieldValue from "@/utils/formatters";

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

const UpdateOrgMemberModal: React.FC<UpdateOrgMemberModalProps> = ({
  isOpen,
  toggle,
  organisationslug,
  role,
  selectedMember,
}) => {
  const [formData, setFormData] = useState<OrgMemberType>({
    title: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    name: "",
    email: "",
    phone: "",
    joining_date: "",
    note: "",
    company_name: "",
    company_address: "",
  });
  const [originalData, setOriginalData] = useState<OrgMemberType>({});
  const [isModified, setIsModified] = useState(false);

  const [updateUser, { isLoading }] = useUpdateOrgMemberMutation();

  useEffect(() => {
    setFormData({
      title: (selectedMember as any)?.title ?? "",
      first_name: (selectedMember as any)?.first_name ?? "",
      middle_name: (selectedMember as any)?.middle_name ?? "",
      last_name: (selectedMember as any)?.last_name ?? "",
      name: (selectedMember as any)?.name ?? "",
      email: (selectedMember as any)?.email ?? "",
      phone: (selectedMember as any)?.phone ?? "",
      joining_date: (selectedMember as any)?.joining_date ?? "",
      note: (selectedMember as any)?.note ?? "",
      company_name: (selectedMember as any)?.company_name ?? "",
      company_address: (selectedMember as any)?.company_address ?? "",
    });
    setOriginalData({
      title: (selectedMember as any)?.title ?? "",
      first_name: (selectedMember as any)?.first_name ?? "",
      middle_name: (selectedMember as any)?.middle_name ?? "",
      last_name: (selectedMember as any)?.last_name ?? "",
      name: (selectedMember as any)?.name ?? "",
      email: (selectedMember as any)?.email ?? "",
      phone: (selectedMember as any)?.phone ?? "",
      joining_date: (selectedMember as any)?.joining_date ?? "",
      note: (selectedMember as any)?.note ?? "",
      company_name: (selectedMember as any)?.company_name ?? "",
      company_address: (selectedMember as any)?.company_address ?? "",
    });
    setIsModified(false);
  }, [selectedMember]);

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

    const memberAlias = formData.alias;
    if (!memberAlias) {
      toast.error(`${formatChoiceFieldValue(role)} alias not found.`);
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
      "joining_date",
      "note",
      "company_name",
      "company_address",
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
      const result = await updateUser({
        organisationslug,
        memberAlias: memberAlias,
        payload,
      });

      if ((result as any)?.data) {
        toast.success(`${formatChoiceFieldValue(role)} updated successfully.`);
        toggle();
      } else if ("error" in (result as any)) {
        toast.error(`Failed to update ${formatChoiceFieldValue(role)}.`);
      } else {
        toast.error("Invalid request.");
      }
    } catch (error) {
      console.error("Failed to update user", error);
      toast.error(
        `Failed to update ${formatChoiceFieldValue(role)}. Please try again.`,
      );
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

export default UpdateOrgMemberModal;
