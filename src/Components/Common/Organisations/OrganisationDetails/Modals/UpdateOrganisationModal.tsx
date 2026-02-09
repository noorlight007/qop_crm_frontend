import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { UpdateOrganisationModalProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const UpdateOrganisationModal: React.FC<UpdateOrganisationModalProps> = ({
  isOpen,
  toggle,
  slug,
  organisationData,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organization: {
      name: "",
      email: "",
      primary_mobile: "",
      other_contact: "",
      website: "",
      contact_person: "",
      license_no: "",
    },
  });

  // API validation errors keyed by dot-notated field paths
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [oldName, setOldName] = useState("");
  // Rtk hooks
  const [updateOrganisation, { isLoading }] = useUpdateOrganisationMutation();

  // Set initial form values when modal opens
  useEffect(() => {
    if (organisationData && isOpen) {
      setFormData({
        organization: {
          name:
            organisationData?.organization?.name ??
            organisationData?.name ??
            "",
          email:
            organisationData?.organization?.email ??
            organisationData?.email ??
            "",
          primary_mobile:
            organisationData?.organization?.primary_mobile ??
            organisationData?.primary_mobile ??
            "",
          other_contact:
            organisationData?.organization?.other_contact ??
            organisationData?.other_contact ??
            "",
          website:
            organisationData?.organization?.website ??
            organisationData?.website ??
            "",
          contact_person:
            organisationData?.organization?.contact_person ??
            organisationData?.contact_person ??
            "",
          license_no:
            organisationData?.organization?.license_no ??
            organisationData?.license_no ??
            "",
        },
      });
      setOldName(
        organisationData?.organization?.name ?? organisationData?.name ?? "",
      );
    }
  }, [organisationData, isOpen]);

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      organization: { ...formData.organization, [name]: value },
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "organization.license_image") {
        setProfileImage(files[0]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Build original organization values to compare against
      const originalOrg = {
        name:
          organisationData?.organization?.name ?? organisationData?.name ?? "",
        email:
          organisationData?.organization?.email ??
          organisationData?.email ??
          "",
        primary_mobile:
          organisationData?.organization?.primary_mobile ??
          organisationData?.primary_mobile ??
          "",
        other_contact:
          organisationData?.organization?.other_contact ??
          organisationData?.other_contact ??
          "",
        website:
          organisationData?.organization?.website ??
          organisationData?.website ??
          "",
        contact_person:
          organisationData?.organization?.contact_person ??
          organisationData?.contact_person ??
          "",
        license_no:
          organisationData?.organization?.license_no ??
          organisationData?.license_no ??
          "",
      } as Record<string, string>;

      // Append only changed text fields
      let hasChanges = false;
      Object.entries(formData.organization).forEach(([key, value]) => {
        const orig = String(originalOrg[key] ?? "");
        const next = String(value ?? "");
        if (next !== orig) {
          formDataToSend.append(`organization.${key}`, next);
          hasChanges = true;
        }
      });

      // Append file only if selected
      if (profileImage) {
        formDataToSend.append("organization.license_image", profileImage);
        hasChanges = true;
      }

      // If nothing changed, avoid calling the API
      if (!hasChanges) {
        toast.info("No changes detected.");
        return;
      }
      // Use RTK Query mutation
      const response = await updateOrganisation({
        slug,
        payload: formDataToSend,
      }).unwrap();
      if (response) {
        toast.success("Organisation updated successfully!");
        // clear previous API errors on success
        setApiErrors({});
        // Redirect if name changed
        if (formData.organization.name !== oldName) {
          router.push("/network/director/organisations");
          toast.warning(
            "Due to the name change, redirected to the Organisations page.",
          );
        } else {
          toggle();
        }
      }
    } catch (error: any) {
      console.error("Update organisation error:", error);

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

      const source =
        error?.data && typeof error.data === "object" ? error.data : error;
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

      const fallback =
        error?.message ?? "Failed to update organisation. Please try again.";
      toast.error(fallback);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h2 className="text-primary">Update Organisation Details</h2>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="name">Organisation Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.organization.name}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors["organization.name"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["organization.name"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.organization.email}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors["organization.email"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["organization.email"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="primary_mobile">Primary Phone</Label>
                <Input
                  type="text"
                  id="primary_mobile"
                  name="primary_mobile"
                  value={formData.organization.primary_mobile}
                  onChange={handleInputChange}
                />
                {apiErrors["organization.primary_mobile"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["organization.primary_mobile"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="website">
                  Website{" "}
                  <span style={{ fontSize: "0.7rem", color: "#f39c12" }}>
                    (Example: https://yourdomain.com)
                  </span>
                </Label>
                <Input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.organization.website}
                  onChange={handleInputChange}
                />
                {apiErrors["organization.website"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["organization.website"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="contact_person">Contact Person</Label>
                <Input
                  type="text"
                  id="contact_person"
                  name="contact_person"
                  value={formData.organization.contact_person}
                  onChange={handleInputChange}
                />
                {apiErrors["organization.contact_person"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["organization.contact_person"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="other_contact">Other Contact</Label>
                <Input
                  type="text"
                  id="other_contact"
                  name="other_contact"
                  value={formData.organization.other_contact}
                  onChange={handleInputChange}
                />
                {apiErrors["organization.other_contact"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["organization.other_contact"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="license_no">License Number</Label>
                <Input
                  type="text"
                  id="license_no"
                  name="license_no"
                  value={formData.organization.license_no}
                  onChange={handleInputChange}
                />
                {apiErrors["organization.license_no"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["organization.license_no"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
            {/* License Image Upload */}
            <Col md="6">
              <FormGroup>
                <Label for="organization.license_image">License Image</Label>
                <Input
                  type="file"
                  id="organization.license_image"
                  name="organization.license_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              {organisationData?.organization.license_image ? (
                <div className="d-flex justify-content-center mt-2">
                  <Image
                    src={organisationData.organization.license_image}
                    alt="License Image"
                    width={100}
                    height={80}
                    className="rounded-2 w-50 border border-success"
                  />
                </div>
              ) : (
                <div className="text-center mt-2 fw-medium opacity-50">
                  <h6>Image not available</h6>
                </div>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateOrganisationModal;
