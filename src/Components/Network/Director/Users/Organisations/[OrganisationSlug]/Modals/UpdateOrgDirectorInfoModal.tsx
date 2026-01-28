import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { UpdateOrganisationModalProps } from "@/Types/Network/Director/OrganisationsTypes";
import { useEffect, useState } from "react";
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

const UpdateOrgDirectorInfoModal: React.FC<UpdateOrganisationModalProps> = ({
  isOpen,
  toggle,
  organisationData,
  slug,
}) => {
  const [updateOrganisation, { isLoading: isUpdating }] =
    useUpdateOrganisationMutation();

  const [form, setForm] = useState({
    title: null as string | null,
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  // Prefill when modal opens / organisationData changes
  useEffect(() => {
    if (!organisationData) return;

    const director =
      organisationData.users?.find(
        (u: any) => u?.user?.user_type === "ORGANISATION_DIRECTOR",
      )?.user ?? organisationData.users?.[0]?.user;

    if (director) {
      setForm({
        title: director.title ?? null,
        first_name: director.first_name ?? director.name ?? "",
        middle_name: director.middle_name ?? "",
        last_name: director.last_name ?? "",
        email: director.email ?? "",
        phone: director.phone ?? "",
      });
    }
  }, [organisationData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      // Append every user_data field explicitly
      payload.append("user_data.title", form.title ?? "");
      payload.append("user_data.first_name", form.first_name ?? "");
      payload.append("user_data.middle_name", form.middle_name ?? "");
      payload.append("user_data.last_name", form.last_name ?? "");
      payload.append("user_data.email", form.email ?? "");
      payload.append("user_data.phone", form.phone ?? "");

      const targetSlug = slug ?? organisationData?.slug;
      if (!targetSlug) {
        toast.error("Organisation identifier missing");
        return;
      }

      await updateOrganisation({ slug: targetSlug, payload }).unwrap();
      toast.success("Director info updated");
      toggle();
    } catch (err: any) {
      console.error("Update director error:", err);
      const msg = err?.data?.detail || err?.message || "Update failed";
      toast.error(msg);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          <h3 className="text-primary">Update Organisation Director Info</h3>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label for="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="first_name">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="middle_name">Middle name</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  value={form.middle_name}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="last_name">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="warning" onClick={toggle} type="button">
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateOrgDirectorInfoModal;
