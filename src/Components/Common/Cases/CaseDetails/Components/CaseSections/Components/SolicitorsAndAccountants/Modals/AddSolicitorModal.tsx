import { useAddSolicitorDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SolicitorAndAccountant/SolicitorAndAccountantApi";
import { apiAddress } from "@/services/third-party-api";
import { AddSolicitorModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/SolicitorAndAccountantTypes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
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

const AddSolicitorModal: React.FC<AddSolicitorModalProps> = ({
  isOpen,
  toggle,
}) => {
  const [addSolicitorDetails, { isLoading }] = useAddSolicitorDetailsMutation();

  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const toggleAddressModal = () => setIsAddressModalOpen(!isAddressModalOpen);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) setErrors({});
  }, [isOpen]);

  const [postcode, setPostcode] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [county, setCounty] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const LONDON_CENTER = { lat: 51.5074, lng: -0.1278 };
  const DEFAULT_ZOOM = 10;
  const DETAIL_ZOOM = 16;
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const [mapCoords, setMapCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const getGoogleMapEmbedUrl = (
    lat: number,
    lng: number,
    zoom: number,
  ): string => {
    return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  };

  const handleManualAddressChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    setMapCoords(LONDON_CENTER);
    setCurrentZoom(DEFAULT_ZOOM);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const payload = {
        name: formData.get("solicitorName"),
        user_type: "SOLICITOR",
        sra_number: formData.get("sraNumber") || "",
        postcode: formData.get("postcode"),
        building_name_or_number: formData.get("buildingName") || "",
        street: formData.get("street"),
        city: formData.get("city"),
        county: formData.get("county") || "",
        country: formData.get("country"),
        latitude: mapCoords ? mapCoords.lat : null,
        longitude: mapCoords ? mapCoords.lng : null,
        phone_number: formData.get("phoneNumber"),
        fax_number: formData.get("faxNumber"),
        dx_number: formData.get("dxNumber"),
        contact_name: formData.get("contactName"),
        email_address: formData.get("emailAddress") || "",
        number_of_partners_in_firm: formData.get("numberOfPartners") || null,
        qualifications: formData.get("qualifications"),
      };

      const response = await addSolicitorDetails({
        solicitorDetails: payload,
      });

      if (response.data) {
        toast.success("Solicitor added successfully!");
        setErrors({});
        toggle();
      } else if (response.error) {
        const errData =
          (response.error as any)?.data || (response.error as any) || {};
        const parsed = parseApiErrors(errData);
        setErrors(parsed);
        const first = Object.values(parsed)[0] || "Failed to add solicitor";
        toast.error(String(first));
      } else {
        toast.error("Failed to add solicitor. Please try again!");
      }
    } catch (error) {
      console.error("Failed to add solicitor:", error);
      const parsed = parseApiErrors((error as any)?.response || error);
      setErrors(parsed);
      const first =
        Object.values(parsed)[0] ||
        "Failed to add solicitor. Please try again!";
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
      if (err.detail) out["non_field_errors"] = sanitize(err.detail);
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
      console.log("Raw Axios Error:", err);
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
      console.log("address details: ", address);

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      const building_name_and_number = [
        address.building_number,
        address.building_name,
      ]
        .filter(Boolean)
        .join(" ");

      setBuildingName(building_name_and_number || "");
      setAddress1(address.line_1 || "");
      setAddress2(address.line_2 || "");
      setCity(address.town_or_city || "");
      setCounty(address.county || "");
      setCountry(address.country || "");

      if (address.latitude && address.longitude) {
        setMapCoords({
          lat: Number(address.latitude),
          lng: Number(address.longitude),
        });
        setCurrentZoom(DETAIL_ZOOM);
      }

      console.log("address details: ", address);
    } catch (error) {
      console.error("Error fetching detailed address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMapCoords(null);
      setPostcode("");
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Solicitor</span>
      </ModalHeader>
      <ModalBody className="px-4 py-4">
        <Form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
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
                            )
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
                      title="Solicitor Location"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="solicitorName">Solicitor Full Name*</Label>
                    <Input
                      id="solicitorName"
                      name="solicitorName"
                      type="text"
                      required
                    />
                    {(errors.solicitorName || errors.name) && (
                      <div className="text-danger">
                        {errors.solicitorName || errors.name}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="sraNumber">SRA Number</Label>
                    <Input id="sraNumber" name="sraNumber" type="text" />
                    {(errors.sraNumber || errors.sra_number) && (
                      <div className="text-danger">
                        {errors.sraNumber || errors.sra_number}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="qualifications">Qualification</Label>
                    <Input
                      id="qualifications"
                      name="qualifications"
                      type="text"
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
                    <Label for="postcode">Postcode*</Label>
                    <InputGroup className="d-flex align-items-center gap-2">
                      <Input
                        id="postcode"
                        type="text"
                        name="postcode"
                        className="rounded"
                        value={postcode}
                        onChange={(e) =>
                          handleManualAddressChange(setPostcode, e.target.value)
                        }
                        required
                      />
                      <Button
                        color="primary"
                        type="button"
                        className="text-nowrap"
                        onClick={() => fetchAddressByPostcode(postcode)}
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="buildingName">Building Name or Number</Label>
                    <Input
                      id="buildingName"
                      name="buildingName"
                      type="text"
                      value={buildingName}
                      onChange={(e) =>
                        handleManualAddressChange(
                          setBuildingName,
                          e.target.value,
                        )
                      }
                    />
                    {(errors.buildingName ||
                      errors.building_name_or_number) && (
                      <div className="text-danger">
                        {errors.buildingName || errors.building_name_or_number}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="street">Street</Label>
                    <Input id="street" name="street" type="text" />
                    {errors.street && (
                      <div className="text-danger">{errors.street}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={city}
                      onChange={(e) =>
                        handleManualAddressChange(setCity, e.target.value)
                      }
                    />
                    {errors.city && (
                      <div className="text-danger">{errors.city}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="county">County</Label>
                    <Input
                      id="county"
                      name="county"
                      type="text"
                      value={county}
                      onChange={(e) =>
                        handleManualAddressChange(setCounty, e.target.value)
                      }
                    />
                    {errors.county && (
                      <div className="text-danger">{errors.county}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      value={country}
                      onChange={(e) =>
                        handleManualAddressChange(setCountry, e.target.value)
                      }
                    />
                    {errors.country && (
                      <div className="text-danger">{errors.country}</div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" />
                    {(errors.phoneNumber || errors.phone_number) && (
                      <div className="text-danger">
                        {errors.phoneNumber || errors.phone_number}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="faxNumber">Fax Number</Label>
                    <Input id="faxNumber" name="faxNumber" type="tel" />
                    {(errors.faxNumber || errors.fax_number) && (
                      <div className="text-danger">
                        {errors.faxNumber || errors.fax_number}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dxNumber">DX Number</Label>
                    <Input id="dxNumber" name="dxNumber" type="text" />
                    {(errors.dxNumber || errors.dx_number) && (
                      <div className="text-danger">
                        {errors.dxNumber || errors.dx_number}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="contactName">Contact Name</Label>
                    <Input id="contactName" name="contactName" type="text" />
                    {(errors.contactName || errors.contact_name) && (
                      <div className="text-danger">
                        {errors.contactName || errors.contact_name}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="emailAddress">Email Address</Label>
                    <Input id="emailAddress" name="emailAddress" type="email" />
                    {(errors.emailAddress || errors.email_address) && (
                      <div className="text-danger">
                        {errors.emailAddress || errors.email_address}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="numberOfPartners">
                      Number of Partners in firm
                    </Label>
                    <Input
                      id="numberOfPartners"
                      name="numberOfPartners"
                      type="number"
                    />
                    {(errors.numberOfPartners ||
                      errors.number_of_partners_in_firm) && (
                      <div className="text-danger">
                        {errors.numberOfPartners ||
                          errors.number_of_partners_in_firm}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="d-flex justify-content-between">
                  <Button type="button" color="secondary" onClick={toggle}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    {isLoading ? "Saving..." : "Save Solicitor"}
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
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

export default AddSolicitorModal;
