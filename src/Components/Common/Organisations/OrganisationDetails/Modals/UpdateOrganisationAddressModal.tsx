import { useUpdateOrganisationMutation } from "@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi";
import { UpdateOrganisationModalProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import { countries } from "@/utils/Countries";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

const UpdateOrganisationAddressModal: React.FC<
  UpdateOrganisationModalProps
> = ({ isOpen, toggle, slug, organisationData }) => {
  const [updateOrganisation, { isLoading: isUpdating }] =
    useUpdateOrganisationMutation();

  const [formData, setFormData] = useState({
    address: {
      postcode: "",
      house_name_or_number: "",
      address_line_1: "",
      city: "",
      country: "",
    },
  });

  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!isOpen || !organisationData) return;

    setFormData({
      address: {
        postcode: organisationData.address?.postcode ?? "",
        house_name_or_number:
          organisationData.address?.house_name_or_number ?? "",
        address_line_1: organisationData.address?.address_line_1 ?? "",
        city: organisationData.address?.city ?? "",
        country: organisationData.address?.country ?? "",
      },
    });
  }, [isOpen, organisationData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handlePostcodeLookup = () => {
    toast.info("Postcode lookup is not available yet.");
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      const originalAddress = {
        postcode: organisationData?.address?.postcode ?? "",
        house_name_or_number:
          organisationData?.address?.house_name_or_number ?? "",
        address_line_1: organisationData?.address?.address_line_1 ?? "",
        city: organisationData?.address?.city ?? "",
        country: organisationData?.address?.country ?? "",
      } as Record<string, string>;

      let hasChanges = false;
      Object.entries(formData.address).forEach(([key, value]) => {
        const next = String(value ?? "");
        const original = String(originalAddress[key] ?? "");
        if (next !== original) {
          payload.append(`address.${key}`, next);
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        toast.info("No changes detected.");
        return;
      }

      const organisationSlug =
        slug ?? organisationData?.organization?.slug ?? organisationData?.slug;

      if (!organisationSlug) {
        toast.error("Organisation identifier is missing.");
        return;
      }

      const response = await updateOrganisation({
        slug: organisationSlug,
        payload,
      }).unwrap();

      if (response) {
        toast.success("Organisation address updated successfully.");
        setApiErrors({});
        toggle();
      }
    } catch (err: any) {
      console.error("Update organisation address error:", err);
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

      const fallback = err?.message ?? "Failed to update organisation address.";
      toast.error(fallback);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
            <h3 className="text-primary">Update Organisation Address</h3>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12">
              <FormGroup>
                <Label for="postcode">
                  Postcode<span className="text-danger">*</span>
                </Label>
                <InputGroup>
                  <Input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.address.postcode}
                    onChange={handleInputChange}
                    placeholder="Enter postcode"
                    className="rounded-end-0"
                    required
                  />
                  <Button
                    color="info"
                    type="button"
                    className="text-nowrap rounded-start-0"
                    onClick={handlePostcodeLookup}
                  >
                    Lookup
                  </Button>
                </InputGroup>
                {apiErrors["address.postcode"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.postcode"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="house_name_or_number">
                  House Name / Number<span className="text-danger">*</span>
                </Label>
                <Input
                  id="house_name_or_number"
                  name="house_name_or_number"
                  type="text"
                  value={formData.address.house_name_or_number}
                  onChange={handleInputChange}
                  placeholder="Enter house name or number"
                  required
                />
                {apiErrors["address.house_name_or_number"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.house_name_or_number"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="address_line_1">
                  Address Line 1<span className="text-danger">*</span>
                </Label>
                <Input
                  id="address_line_1"
                  name="address_line_1"
                  type="text"
                  value={formData.address.address_line_1}
                  onChange={handleInputChange}
                  placeholder="Enter address line 1"
                  required
                />
                {apiErrors["address.address_line_1"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.address_line_1"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="city">
                  City<span className="text-danger">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                />
                {apiErrors["address.city"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.city"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>

            <Col md="6">
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  type="select"
                  id="country"
                  name="country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  placeholder="Enter country"
                >
                  <option value="">Select...</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Input>
                {apiErrors["address.country"] ? (
                  <div className="text-danger small mt-1">
                    {apiErrors["address.country"].join(", ")}
                  </div>
                ) : null}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            outline
            type="button"
            onClick={toggle}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save changes"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default UpdateOrganisationAddressModal;
