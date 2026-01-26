import { useAddAccountantDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SolicitorAndAccountant/SolicitorAndAccountantApi";
import { apiAddress } from "@/services/third-party-api";
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
  ModalHeader,
  Row,
} from "reactstrap";
import GetAddressModal from "../../../CommonModals/GetAddressModal";

interface AddAccountantModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddAccountantModal: React.FC<AddAccountantModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [accountantDetails, { isLoading }] = useAddAccountantDetailsMutation();
  const [formData, setFormData] = useState({
    name: "",
    qualifications: "",
    company_name: "",
    postcode: "",
    building_name_or_number: "",
    street: "",
    city: "",
    county: "",
    country: "",
    phone_number: "",
    fax_number: "",
    email_address: "",
  });
  console.log(formData);

  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const toggleAddressModal = () => setIsAddressModalOpen(!isAddressModalOpen);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) setErrors({});
  }, [isOpen]);

  const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };
  const DEFAULT_ZOOM = 10;
  const DETAIL_ZOOM = 16;
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(LONDON_CENTER);

  const getGoogleMapEmbedUrl = (
    lat: number,
    lng: number,
    zoom: number,
  ): string => {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const addressFields = [
      "postcode",
      "building_name_or_number",
      "street",
      "address_line1",
      "city",
      "county",
      "country",
    ];

    if (addressFields.includes(name)) {
      setMapCoords(LONDON_CENTER);
      setCurrentZoom(DEFAULT_ZOOM);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await accountantDetails({ accountantDetails: formData });
      if (res.data) {
        toast.success("Accountant added successfully!");
        setErrors({});
        toggle();
        setFormData({
          name: "",
          qualifications: "",
          company_name: "",
          postcode: "",
          building_name_or_number: "",
          street: "",
          city: "",
          county: "",
          country: "",
          phone_number: "",
          fax_number: "",
          email_address: "",
        });
      } else if (res.error) {
        const errData = (res.error as any)?.data || (res.error as any) || {};
        const parsed = parseApiErrors(errData);
        setErrors(parsed);
        const first = Object.values(parsed)[0] || "Failed to add accountant";
        toast.error(String(first));
      }
    } catch (error) {
      const parsed = parseApiErrors((error as any)?.response || error);
      setErrors(parsed);
      const first =
        Object.values(parsed)[0] ||
        "Failed to add accountant. Please try again.";
      toast.error(String(first));
    }
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!err) return out;

    const sanitize = (msg: any) => {
      if (msg == null) return "";
      let s = String(msg);
      s = s.replace(/^\s*\d+,\s*/g, "");
      return s;
    };

    if (typeof err === "string") {
      out["non_field_errors"] = sanitize(err);
      return out;
    }

    if (err && typeof err === "object") {
      // Common shapes: { field: ["msg"] } or { detail: "msg" }
      if (err.detail) {
        out["non_field_errors"] = sanitize(err.detail);
      }
      for (const [k, v] of Object.entries(err)) {
        if (v == null) continue;
        if (typeof v === "string") out[k] = sanitize(v);
        else if (Array.isArray(v))
          out[k] = sanitize(
            v
              .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
              .join(", "),
          );
        else if (typeof v === "object") {
          const vals: string[] = [];
          for (const vv of Object.values(v)) {
            if (vv == null) continue;
            if (Array.isArray(vv)) vals.push(...vv.map((x) => String(x)));
            else vals.push(String(vv));
          }
          if (vals.length) out[k] = sanitize(vals.join(", "));
        } else out[k] = sanitize(String(v));
      }
      return out;
    }

    out["non_field_errors"] = sanitize(String(err));
    return out;
  };

  const getAddressErrorMessage = (err: any) => {
    if (!err) return "Unknown error";

    if (typeof err === "string") return err;

    if (typeof err?.data === "string") return err.data;

    const collect = (value: any): string[] => {
      if (value == null) return [];

      if (typeof value === "string") return [value];

      if (Array.isArray(value))
        return value.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
        );

      if (typeof value === "object") {
        try {
          return Object.values(value).flatMap((v) => collect(v));
        } catch {
          return [String(value)];
        }
      }

      return [String(value)];
    };

    if (err?.data?.message) return String(err.data.message);

    if (err?.data && typeof err.data === "object") {
      const msgs = collect(err.data);

      if (msgs.length) return msgs.join(", ");
    }

    if (err?.error) return String(err.error);

    if (err?.message) {
      if (/status code/i.test(err.message)) return "Server returned an error";

      return String(err.message);
    }

    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const fetchAddressByPostcode = async (postcode: string) => {
    if (!postcode) return;
    setIsSearchingPostcode(true);
    try {
      const response = await apiAddress.get(
        `/autocomplete/${postcode}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
      );
      setAddressList(response.data.suggestions || []);
      setIsAddressModalOpen(true);
    } catch (err: any) {
      const message = getAddressErrorMessage(err.response || err);
      toast.error(message);
    } finally {
      setIsSearchingPostcode(false);
    }
  };

  const handleSelectAddress = async (id: string) => {
    setIsFetchingAddress(true);
    setIsAddressModalOpen(false);

    try {
      const res = await apiAddress.get(
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`,
      );

      const address = res.data;

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      setFormData((prev: any) => ({
        ...prev,
        postcode: address.postcode || prev.postcode,
        building_name_or_number: [
          address.building_name,
          address.building_number,
        ]
          .filter(Boolean)
          .join(" "),
        street: address.thoroughfare || "",
        city: address.town_or_city || "",
        county: address.county || "",
        country: address.country || "",
        latitude: address.latitude,
        longitude: address.longitude,
      }));

      if (address.latitude !== undefined && address.longitude !== undefined) {
        setMapCoords({ lat: address.latitude, lng: address.longitude });
        setCurrentZoom(DETAIL_ZOOM);
      } else {
        setMapCoords(null);
        setCurrentZoom(DEFAULT_ZOOM);
      }
    } catch (error) {
      console.error("Error fetching detailed address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMapCoords(LONDON_CENTER);
      setCurrentZoom(DEFAULT_ZOOM);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Add New Accountant</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={12}>
              <Label className="fw-semibold mb-2">Location Preview</Label>
              <div className="border rounded overflow-hidden shadow-sm mb-3">
                <iframe
                  src={
                    mapCoords
                      ? getGoogleMapEmbedUrl(
                          mapCoords.lat,
                          mapCoords.lng,
                          currentZoom,
                        ) // Use the dynamic state!
                      : getGoogleMapEmbedUrl(
                          LONDON_CENTER.lat,
                          LONDON_CENTER.lng,
                          DEFAULT_ZOOM,
                        )
                  }
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Location Preview"
                />
              </div>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="name">Accountant Full Name*</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && (
                  <div className="text-danger">{errors.name}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="qualifications">Qualifications</Label>
                <Input
                  id="qualifications"
                  name="qualifications"
                  type="text"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                />
                {errors.qualifications && (
                  <div className="text-danger">{errors.qualifications}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={handleInputChange}
                />
                {errors.company_name && (
                  <div className="text-danger">{errors.company_name}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="postcode">Postcode*</Label>
                <InputGroup className="d-flex align-items-center gap-2">
                  <Input
                    id="postcode"
                    type="text"
                    name="postcode"
                    className="rounded"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    color="primary"
                    type="button"
                    className="text-nowrap"
                    onClick={() => fetchAddressByPostcode(formData.postcode)}
                    disabled={isFetchingAddress || isSearchingPostcode}
                  >
                    {isSearchingPostcode ? "Loading..." : "Lookup"}
                  </Button>
                </InputGroup>
                {errors.postcode && (
                  <div className="text-danger mt-1">{errors.postcode}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="building_name_or_number">
                  Building Name/Number
                </Label>
                <Input
                  id="building_name_or_number"
                  name="building_name_or_number"
                  type="text"
                  value={formData.building_name_or_number}
                  onChange={handleInputChange}
                />
                {errors.building_name_or_number && (
                  <div className="text-danger">
                    {errors.building_name_or_number}
                  </div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="street">Street</Label>
                <Input
                  id="street"
                  name="street"
                  type="text"
                  value={formData.street}
                  onChange={handleInputChange}
                />
                {errors.street && (
                  <div className="text-danger">{errors.street}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <div className="text-danger">{errors.city}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="county">County</Label>
                <Input
                  id="county"
                  name="county"
                  type="text"
                  value={formData.county}
                  onChange={handleInputChange}
                />
                {errors.county && (
                  <div className="text-danger">{errors.county}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleInputChange}
                />
                {errors.country && (
                  <div className="text-danger">{errors.country}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
                {errors.phone_number && (
                  <div className="text-danger">{errors.phone_number}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="fax_number">Fax Number</Label>
                <Input
                  id="fax_number"
                  name="fax_number"
                  type="tel"
                  value={formData.fax_number}
                  onChange={handleInputChange}
                />
                {errors.fax_number && (
                  <div className="text-danger">{errors.fax_number}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email_address">Email Address</Label>
                <Input
                  id="email_address"
                  name="email_address"
                  type="email"
                  value={formData.email_address}
                  onChange={handleInputChange}
                />
                {errors.email_address && (
                  <div className="text-danger">{errors.email_address}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {isLoading ? "Saving..." : "Save Accountant"}
            </Button>
          </div>
        </Form>
      </ModalBody>
      <GetAddressModal
        isOpen={isAddressModalOpen}
        toggle={toggleAddressModal}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </Modal>
  );
};

export default AddAccountantModal;
