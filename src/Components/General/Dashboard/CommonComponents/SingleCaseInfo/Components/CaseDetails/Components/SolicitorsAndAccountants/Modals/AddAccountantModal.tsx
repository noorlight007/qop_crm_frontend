import { useAddAccountantDetailsMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SolicitorAndAccountant/SolicitorAndAccountantApi";
import { apiAddress } from "@/services/third-party-api";
import { useState } from "react";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await accountantDetails({ accountantDetails: formData });
      if (res.data) {
        toast.success("Accountant added successfully!");
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
        const errorMessage =
          (res.error as any)?.data?.detail || "Failed to add accountant";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Failed to add accountant. Please try again.");
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
      }));

      console.log("address details: ", address);
    } catch (error) {
      console.error("Error fetching detailed address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Add New Accountant</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
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
