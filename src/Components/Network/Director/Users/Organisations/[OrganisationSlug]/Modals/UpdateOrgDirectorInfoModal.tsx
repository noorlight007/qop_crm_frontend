import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { UpdateOrganisationModalProps } from "@/Types/Network/Director/OrganisationsTypes";
import { useEffect, useRef, useState } from "react";
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
    user: {
      title: null as string | null,
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  // Keep original values to detect changes
  const originalRef = useRef<Record<string, string | null>>({
    title: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!organisationData) return;
    const original = {
      title: organisationData?.user?.title ?? organisationData?.title ?? null,
      first_name:
        organisationData?.user?.first_name ??
        organisationData?.first_name ??
        "",
      middle_name:
        organisationData?.user?.middle_name ??
        organisationData?.middle_name ??
        "",
      last_name:
        organisationData?.user?.last_name ?? organisationData?.last_name ?? "",
      email: organisationData?.user?.email ?? organisationData?.email ?? "",
      phone: organisationData?.user?.phone ?? organisationData?.phone ?? "",
    } as Record<string, string | null>;
    originalRef.current = original;
    setForm({ user: { ...original } as any });
  }, [organisationData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((s) => ({ ...s, user: { ...s.user, [name]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = new FormData();

      // Only append changed fields
      const orig = originalRef.current;
      let hasChanges = false;
      const userEntries: Array<[string, string]> = [
        ["title", String(form.user.title ?? "")],
        ["first_name", form.user.first_name ?? ""],
        ["middle_name", form.user.middle_name ?? ""],
        ["last_name", form.user.last_name ?? ""],
        ["email", form.user.email ?? ""],
        ["phone", form.user.phone ?? ""],
      ];

      userEntries.forEach(([key, value]) => {
        const originalVal = String(orig[key as keyof typeof orig] ?? "");
        if (value !== originalVal) {
          payload.append(`user.${key}`, value);
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        toast.info("No changes detected.");
        return;
      }

      const targetSlug = slug ?? organisationData?.organization?.slug;
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
                  value={form.user.title ?? ""}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="first_name">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={form.user.first_name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="middle_name">Middle name</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  value={form.user.middle_name}
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
                  value={form.user.last_name}
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
                  value={form.user.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.user.phone}
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
