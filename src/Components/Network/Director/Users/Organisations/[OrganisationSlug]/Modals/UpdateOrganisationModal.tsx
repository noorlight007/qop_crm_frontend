import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Network/Director/Organisations/SingleOrganisation/SingleOrganisationApi";
import { UpdateOrganisationModalProps } from "@/Types/Network/Director/OrganisationsTypes";
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
    name: "",
    email: "",
    primary_mobile: "",
    other_contact: "",
    website: "",
    contact_person: "",
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
      });
      setOldName(
        organisationData?.name ?? organisationData?.organization?.name ?? "",
      );
    }
  }, [organisationData, isOpen]);

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "profile_image") {
        setProfileImage(files[0]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      // Append files if selected
      if (profileImage) {
        formDataToSend.append("profile_image", profileImage);
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
        if (formData.name !== oldName) {
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
        <h3 className="text-primary">Update Organisation</h3>
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
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors.name ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.name.join(", ")}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors.email ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.email.join(", ")}
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
                  value={formData.primary_mobile}
                  onChange={handleInputChange}
                />
                {apiErrors.primary_mobile ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.primary_mobile.join(", ")}
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
                  value={formData.website}
                  onChange={handleInputChange}
                />
                {apiErrors.website ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.website.join(", ")}
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
                  value={formData.contact_person}
                  onChange={handleInputChange}
                />
                {apiErrors.contact_person ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.contact_person.join(", ")}
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
                  value={formData.other_contact}
                  onChange={handleInputChange}
                />
                {apiErrors.other_contact ? (
                  <div className="text-danger small mt-1">
                    {apiErrors.other_contact.join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {/* Profile Image Upload */}
            <Col md="6">
              <FormGroup>
                <Label for="profile_image">Banner Image</Label>
                <Input
                  type="file"
                  id="profile_image"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              {organisationData?.profile_image ? (
                <div className="d-flex justify-content-center mt-2">
                  <Image
                    src={organisationData.profile_image}
                    alt="Profile"
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
