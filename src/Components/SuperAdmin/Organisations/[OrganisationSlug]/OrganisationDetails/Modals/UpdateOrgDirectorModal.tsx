import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { UpdateOrgInfoModalProps } from "@/Types/Admin/Organisations/OrganisationTypes";
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

const UpdateOrgDirectorInfoModal: React.FC<UpdateOrgInfoModalProps> = ({
  isOpen,
  toggle,
  organisationData,
  slug,
}) => {
  const [updateOrganization, { isLoading: isUpdating }] =
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

  // API validation errors keyed by dot-notated field paths
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

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

      const response = await updateOrganization({
        slug: targetSlug,
        payload,
      }).unwrap();
      if (response) {
        setApiErrors({});
        toast.success("Director info updated");
        toggle();
      }
    } catch (err: any) {
      console.error("Update director error:", err);

      const flattenErrors = (
        value: any,
        prefix = "",
      ): Array<{ field: string; messages: string[] }> => {
        const out: Array<{ field: string; messages: string[] }> = [];

        const pushMessages = (fieldPath: string, msgs: any) => {
          if (msgs == null) return;
          if (typeof msgs === "string")
            out.push({ field: fieldPath, messages: [msgs] });
          else if (Array.isArray(msgs))
            out.push({
              field: fieldPath,
              messages: msgs.map((m) =>
                typeof m === "string" ? m : JSON.stringify(m),
              ),
            });
          else if (typeof msgs === "object") {
            Object.entries(msgs).forEach(([k, v]) => {
              const next = fieldPath ? `${fieldPath}.${k}` : k;
              out.push(...flattenErrors(v, next));
            });
          } else out.push({ field: fieldPath, messages: [String(msgs)] });
        };

        if (value && typeof value === "object" && !Array.isArray(value)) {
          Object.entries(value).forEach(([k, v]) => {
            const next = prefix ? `${prefix}.${k}` : k;
            out.push(...flattenErrors(v, next));
          });
          return out;
        }

        if (prefix) pushMessages(prefix, value);
        else if (Array.isArray(value) || typeof value === "string")
          pushMessages("error", value);

        return out;
      };

      const source = err?.data && typeof err.data === "object" ? err.data : err;
      const flattened = flattenErrors(source);
      if (flattened.length) {
        const map: Record<string, string[]> = {};
        flattened.forEach((entry) => {
          const field = entry.field || "error";
          map[field] = map[field]
            ? [...map[field], ...entry.messages]
            : [...entry.messages];
          toast.error(`${entry.messages.join(", ")}`);
        });
        setApiErrors(map);
        return;
      }

      const fallback = err?.message ?? "Update failed";
      toast.error(fallback);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          <h2 className="text-primary">Update Organization Director Info</h2>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="6">
              <FormGroup>
                <Label for="title">
                  Title<span className="text-danger">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="select"
                  value={form.user.title ?? ""}
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
                {apiErrors["user.title"] || apiErrors["title"] ? (
                  <div className="text-danger small mt-1">
                    {(apiErrors["user.title"] || apiErrors["title"]).join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="first_name">
                  First name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={form.user.first_name}
                  onChange={handleChange}
                  required
                />
                {apiErrors["user.first_name"] || apiErrors["first_name"] ? (
                  <div className="text-danger small mt-1">
                    {(
                      apiErrors["user.first_name"] || apiErrors["first_name"]
                    ).join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="middle_name">Middle name</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  value={form.user.middle_name}
                  onChange={handleChange}
                />
                {apiErrors["user.middle_name"] || apiErrors["middle_name"] ? (
                  <div className="text-danger small mt-1">
                    {(
                      apiErrors["user.middle_name"] || apiErrors["middle_name"]
                    ).join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="last_name">
                  Last name<span className="text-danger">*</span>
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={form.user.last_name}
                  onChange={handleChange}
                  required
                />
                {apiErrors["user.last_name"] || apiErrors["last_name"] ? (
                  <div className="text-danger small mt-1">
                    {(
                      apiErrors["user.last_name"] || apiErrors["last_name"]
                    ).join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="email">
                  Email<span className="text-danger">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.user.email}
                  onChange={handleChange}
                  required
                />
                {apiErrors["user.email"] || apiErrors["email"] ? (
                  <div className="text-danger small mt-1">
                    {(apiErrors["user.email"] || apiErrors["email"]).join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.user.phone}
                  onChange={handleChange}
                />
                {apiErrors["user.phone"] || apiErrors["phone"] ? (
                  <div className="text-danger small mt-1">
                    {(apiErrors["user.phone"] || apiErrors["phone"]).join(", ")}
                  </div>
                ) : null}
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
