import { useUpdateNetworkMutation } from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { UpdateNetworkInfoModalProps } from "@/Types/Admin/Networks/NetworkType";
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

const UpdateNetworkInfoModal: React.FC<UpdateNetworkInfoModalProps> = ({
  isOpen,
  toggle,
  slug,
  networkData,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    network: {
      name: "",
      email: "",
      primary_mobile: "",
      other_contact: "",
      website: "",
      contact_person: "",
    },
  });

  console.log("Network Data in Modal:", networkData);

  // API validation errors keyed by dot-notated field paths
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [oldName, setOldName] = useState("");
  // Rtk hooks
  const [updateNetwork, { isLoading: isUpdating }] = useUpdateNetworkMutation();

  // Set initial form values when modal opens
  useEffect(() => {
    if (networkData && isOpen) {
      setFormData({
        network: {
          name:
            networkData?.network?.name ??
            networkData?.name ??
            "",
          email:
            networkData?.network?.email ??
            networkData?.email ??
            "",
          primary_mobile:
            networkData?.network?.primary_mobile ??
            networkData?.primary_mobile ??
            "",
          other_contact:
            networkData?.network?.other_contact ??
            networkData?.other_contact ??
            "",
          website:
            networkData?.network?.website ??
            networkData?.website ??
            "",
          contact_person:
            networkData?.network?.contact_person ??
            networkData?.contact_person ??
            "",
        },
      });
      setOldName(
        networkData?.network?.name ?? networkData?.name ?? "",
      );
    }
  }, [networkData, isOpen]);

  // Handle input change for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      network: { ...formData.network, [name]: value },
    });
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "network.license_image") {
        setProfileImage(files[0]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Build original network values to compare against
      const originalNetwork = {
        name:
          networkData?.network?.name ?? networkData?.name ?? "",
        email:
          networkData?.network?.email ??
          networkData?.email ??
          "",
        primary_mobile:
          networkData?.network?.primary_mobile ??
          networkData?.primary_mobile ??
          "",
        other_contact:
          networkData?.network?.other_contact ??
          networkData?.other_contact ??
          "",
        website:
          networkData?.network?.website ??
          networkData?.website ??
          "",
        contact_person:
          networkData?.network?.contact_person ??
          networkData?.contact_person ??
          "",
      } as Record<string, string>;

      // Append only changed text fields
      let hasChanges = false;
      Object.entries(formData.network).forEach(([key, value]) => {
        const orig = String(originalNetwork[key] ?? "");
        const next = String(value ?? "");
        if (next !== orig) {
          formDataToSend.append(`network.${key}`, next);
          hasChanges = true;
        }
      });

      // Append file only if selected
      if (profileImage) {
        formDataToSend.append("network.license_image", profileImage);
        hasChanges = true;
      }

      // If nothing changed, avoid calling the API
      if (!hasChanges) {
        toast.info("No changes detected.");
        return;
      }
      // Use RTK Query mutation
      const response = await updateNetwork({
        network_slug:slug,
        payload: formDataToSend,
      }).unwrap();
      if (response) {
        toast.success("Network updated successfully!");
        // clear previous API errors on success
        setApiErrors({});
        // Redirect if name changed
        if (formData.network.name !== oldName) {
          router.push("/admin/networks");
          toast.warning(
            "Due to the name change, redirected to the Networks page.",
          );
        } else {
          toggle();
        }
      }
    } catch (error: any) {
      console.error("Update network error:", error);

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
        error?.message ?? "Failed to update network. Please try again.";
      toast.error(fallback);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        <h2 className="text-primary">Update Network Details</h2>
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="name">Network Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.network.name}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors["network.name"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["network.name"].join(", ")}
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
                  value={formData.network.email}
                  onChange={handleInputChange}
                  required
                />
                {apiErrors["network.email"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["network.email"].join(", ")}
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
                  value={formData.network.primary_mobile}
                  onChange={handleInputChange}
                />
                {apiErrors["network.primary_mobile"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["network.primary_mobile"].join(", ")}
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
                  value={formData.network.website}
                  onChange={handleInputChange}
                />
                {apiErrors["network.website"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["network.website"].join(", ")}
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
                  value={formData.network.contact_person}
                  onChange={handleInputChange}
                />
                {apiErrors["network.contact_person"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["network.contact_person"].join(", ")}
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
                  value={formData.network.other_contact}
                  onChange={handleInputChange}
                />
                {apiErrors["network.other_contact"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["network.other_contact"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            {/* Profile Image Upload */}
            <Col md="6">
              <FormGroup>
                <Label for="network.license_image">License Image</Label>
                <Input
                  type="file"
                  id="network.license_image"
                  name="network.license_image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              {networkData?.network.license_image ? (
                <div className="d-flex justify-content-center mt-2">
                  <Image
                    src={networkData.network.license_image}
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
          <Button color="primary" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateNetworkInfoModal;
