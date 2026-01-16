import { useAddSolicitorDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SolicitorAndAccountant/SolicitorAndAccountantApi";
import { apiAddress } from "@/services/third-party-api";
import { AddSolicitorModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SolicitorAndAccountantTypes";
import { useState } from "react";
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

  const [postcode, setPostcode] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [county, setCounty] = useState<string>("");
  const [country, setCountry] = useState<string>("");

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
        toggle();
      } else if (response.error) {
        const errorMessage =
          (response.error as any)?.data?.detail || "Failed to add solicitor";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to add solicitor. Please try again!");
      }
    } catch (error) {
      console.error("Failed to add solicitor:", error);
      toast.error("Failed to add solicitor. Please try again!");
    }
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
          typeof v === "string" ? v : JSON.stringify(v)
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
        `/autocomplete/${postcode}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`
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
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`
      );

      const address = res.data;

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

      console.log("address details: ", address);
    } catch (error) {
      console.error("Error fetching detailed address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

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
                <Col md={4}>
                  <FormGroup>
                    <Label for="solicitorName">Solicitor Full Name*</Label>
                    <Input
                      id="solicitorName"
                      name="solicitorName"
                      type="text"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label for="sraNumber">SRA Number</Label>
                    <Input id="sraNumber" name="sraNumber" type="text" />
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
                        onChange={(e) => setPostcode(e.target.value)}
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
                      onChange={(e) => setBuildingName(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="street">Street</Label>
                    <Input id="street" name="street" type="text" />
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
                      onChange={(e) => setCity(e.target.value)}
                    />
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
                      onChange={(e) => setCounty(e.target.value)}
                    />
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
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" type="tel" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="faxNumber">Fax Number</Label>
                    <Input id="faxNumber" name="faxNumber" type="tel" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dxNumber">DX Number</Label>
                    <Input id="dxNumber" name="dxNumber" type="text" />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="contactName">Contact Name</Label>
                    <Input id="contactName" name="contactName" type="text" />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="emailAddress">Email Address</Label>
                    <Input id="emailAddress" name="emailAddress" type="email" />
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
