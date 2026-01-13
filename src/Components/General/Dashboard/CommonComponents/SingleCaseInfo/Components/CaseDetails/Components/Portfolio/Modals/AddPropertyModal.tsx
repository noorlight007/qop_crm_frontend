import {
  useAddPropertyDetailsMutation,
  useGetPortfolioApplicantsQuery,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Portfolio/PortfolioApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SectionCompleteApi";
import formatChoiceFieldValue from "@/utils/formatters";
import { limitDecimalPlaces } from "@/utils/inputHandlers";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { X } from "react-feather";
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
import "../PortfolioContent.css";
import { apiAddress } from "@/services/third-party-api";
import GetAddressModal from "../../../CommonModals/GetAddressModal";
import { useGetPropertyEPCRatingMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Common/PropertyEPCRating";

interface AddPortfolioContentModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddPropertyModal: React.FC<AddPortfolioContentModalProps> = ({
  isOpen,
  toggle,
}) => {
  const params = useParams();
  const { casealias } = params;
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [addPropertyDetails, { isLoading: isAddPropertiesLoading }] =
    useAddPropertyDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();
  const { data, isLoading: isGetApplicantsLoading } =
    useGetPortfolioApplicantsQuery({
      case_alias: casealias,
    });
  const [ postcode, setPostcode ] = useState('');
  const [fetchedEpcRating, setFetchedEpcRating] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [address1, setAddress1] = useState<string>("");
  const [address2, setAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [county, setCounty] = useState<string>("");
  const [country, setCountry] = useState<string>("");


  const [
    getPropertyEPCRating,{ isLoading: isEpcLoading},
  ] = useGetPropertyEPCRatingMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add validation for applicants
    if (selectedApplicants.length === 0) {
      toast.error("Please select at least one applicant!");
      return;
    }

    const formData = new FormData(e.currentTarget);
    try {
      const payload = {
        applicant_ids: selectedApplicants.map((id) => Number(id)),
        postcode: formData.get("postcode"),
        house_name_or_number: formData.get("houseNumber"),
        address_1: formData.get("address1"),
        address_2: formData.get("address2") || null,
        city: formData.get("city"),
        county: formData.get("county") || null,
        country: formData.get("country"),
        property_value: formData.get("propertyValue"),
        current_mortgage_balance: formData.get("currentMortgageBalance"),
        monthly_rental_income: formData.get("monthlyRental"),
        monthly_mortgage_payment: formData.get("monthlyPayment"),
        value_at_purchase: formData.get("valueAtPurchase"),
        date_purchased: formData.get("datePurchased") || null,
        is_hmo: formData.get("isHMO") === "on",
        is_mufb: formData.get("isMUFB") === "on",
        mortgage_lender: formData.get("mortgageLender") || null,
        repayment_type: formData.get("repaymentType") || null,
        to_be_repaid: formData.get("toBeRepaid") || null,
        current_rate: formData.get("currentRate") || null,
        rate_type: formData.get("rateType") || null,
        current_rate_end_date: formData.get("currentRateEndDate") || null,
        erc_end_date: formData.get("ercEndDate") || null,
        account_number: formData.get("accountNumber"),
        property_type: formData.get("propertyType"),
        ownership: formData.get("ownership") || null,
        leasehold: formData.get("leasehold") || null,
        year_built: formData.get("yearBuilt") || null,
        number_of_bedrooms: formData.get("numberOfBedrooms") || null,
        remaining_mortgage_term: formData.get("remainingMortgageTerm") || null,
        is_limited_company: true,
        epc_rating: formData.get("epcRating") || null,
        note: formData.get("note") || null,
      };
      const response = await addPropertyDetails({
        case_alias: casealias,
        propertyDetails: payload,
      });

      if (response.data) {
        toast.success("Property added successfully!");
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_portfolio: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
        // Portfolio summary will be refreshed via RTK Query tag invalidation.
        toggle();
      } else if (response.error) {
        const errorMessage =
          (response.error as any)?.data?.detail || "Failed to add property";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Failed to add property:", error);
      toast.error("Failed to add property. Please try again!");
    }
  };

  const handleSelect = (id: string) => {
    if (!selectedApplicants.includes(id)) {
      setSelectedApplicants([...selectedApplicants, id]);
    }
  };

  const removeApplicant = (id: string) => {
    setSelectedApplicants(selectedApplicants.filter((appId) => appId !== id));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsDropdownOpen(false);
    }

    if (isDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Filter out selected applicants from the dropdown options
  const filteredData = data?.filter(
    (applicant: any) => !selectedApplicants.includes(applicant.id.toString())
  );

  const fetchAddressByPostcode = async (postcode: string) => {
    if (!postcode) return;
    try {
      const response = await apiAddress.get(
        `/autocomplete/${postcode}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`
      );
      setAddressList(response.data.suggestions || []);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error looking up address:", err);
    }
  };

  const buildFullAddressForEPC = (property: {
    address_one?: string;
    address_two?: string;
    address_three?: string;
    address_four?: string;
  }) => {
    return [
      property.address_one,
      property.address_two,
      property.address_three,
      property.address_four,
    ]
      .filter((line) => Boolean(line && line.trim()))
      .join(", ");
  };

  const handleSelectAddress = async (id: string) => {
    setIsFetchingAddress(true);
    setIsModalOpen(false);

    try {
      const res = await apiAddress.get(
        `/get/${id}?api-key=${process.env.NEXT_PUBLIC_GET_ADDRESS_API_KEY}`
      );

      const address = res.data;

      if (!address) {
        console.error("❌ No address returned");
        return;
      }

      console.log("address details: ", address);

      // setAddress1(address.line_1);

      setHouseNumber(address.building_number || address.building_name || '');
      setAddress1(address.line_1 || '');
      setAddress2(address.line_2 || '');
      setCity(address.town_or_city || '');
      setCounty(address.county || '');
      setCountry(address.country || '');

      const fullAddressForEPC = buildFullAddressForEPC({
      address_one: address.line_1,
      address_two: address.line_2,
      address_three: address.line_3,
      address_four: address.line_4,
    });

    console.log("📍 EPC request address:", fullAddressForEPC);

    const epcResponse = await getPropertyEPCRating({
      case_alias: casealias as string,
      property_postcode: address.postcode,
      property_address: fullAddressForEPC,
    }).unwrap();
    setFetchedEpcRating(epcResponse.epc_rating);
    console.log("✅ EPC Rating received:", epcResponse.epc_rating);
    } catch (error) {
      console.error("Error fetching detailed address:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add Property</span>
      </ModalHeader>
      <ModalBody className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="applicants">Applicant/s*</Label>
                <div className="position-relative" ref={dropdownRef}>
                  {/* Custom Input Field */}
                  <div
                    className="form-control d-flex flex-wrap align-items-center position-relative custom_input_field"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedApplicants.length === 0 && (
                      <span className="text-muted">Select applicants...</span>
                    )}
                    {selectedApplicants.map((id) => {
                      const applicant = data.find(
                        (a: any) => a.id === Number(id)
                      );
                      return (
                        <span
                          key={id}
                          className="badge bg-primary me-1 mb-1 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeApplicant(id);
                          }}
                        >
                          {applicant?.title
                            ? formatChoiceFieldValue(applicant?.title)
                            : ""}{" "}
                          {applicant?.first_name} {applicant?.middle_name}{" "}
                          {applicant?.last_name}
                          <span className="ms-1">x</span>
                        </span>
                      );
                    })}
                    <i
                      className="fa-solid fa-angle-down position-absolute"
                      style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    ></i>
                  </div>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="position-absolute w-100 bg-white border mt-1 rounded-2 dropdown_style">
                      {/* Close Button - Moved to top */}
                      <div
                        className="text-end p-1 bg-primary sticky-top border-bottom dropdown_close"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="fw-bold fs-5">
                          <X size={20} />
                        </span>
                      </div>
                      {/* Dropdown Options */}
                      {filteredData?.map((applicant: any) => (
                        <div
                          key={applicant.id}
                          className="px-2 py-1 dropdown_item"
                          onClick={() => handleSelect(applicant.id)}
                        >
                          {applicant?.title
                            ? formatChoiceFieldValue(applicant?.title)
                            : ""}{" "}
                          {applicant?.first_name} {applicant?.middle_name}{" "}
                          {applicant?.last_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="postcode">Postcode*</Label>
                <InputGroup className="d-flex align-items-center gap-2">
                  <Input
                    id="postcode"
                    type="text"
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
                  >
                    Lookup
                  </Button>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="houseNumber">House Name Or Number*</Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="address1">Address 1*</Label>
                <Input
                  id="address1"
                  name="address1"
                  type="text"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="address2">Address 2</Label>
                <Input
                  id="address2"
                  name="address2"
                  type="text"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="city">City*</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
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
            <Col md={4}>
              <FormGroup>
                <Label for="country">Country*</Label>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="propertyValue">Property Value*</Label>
                <Input
                  id="propertyValue"
                  name="propertyValue"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="currentMortgageBalance">
                  Current Mortgage Balance*
                </Label>
                <Input
                  id="currentMortgageBalance"
                  name="currentMortgageBalance"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="monthlyRental">Monthly Rental Income*</Label>
                <Input
                  id="monthlyRental"
                  name="monthlyRental"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="monthlyPayment">Monthly Mortgage Payment</Label>
                <Input
                  id="monthlyPayment"
                  name="monthlyPayment"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="valueAtPurchase">Value At Purchase</Label>
                <Input
                  id="valueAtPurchase"
                  name="valueAtPurchase"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="datePurchased">Date Purchased</Label>
                <Input id="datePurchased" name="datePurchased" type="date" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="isHMO"
                    className="border-primary"
                  />
                  Is the property an HMO
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="isMUFB"
                    className="border-primary"
                  />
                  Is the property a MUFB
                </Label>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="mortgageLender">Mortgage Lender</Label>
                <Input id="mortgageLender" name="mortgageLender" type="text" />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="repaymentType">Repayment Type</Label>
                <Input id="repaymentType" name="repaymentType" type="text" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="currentRate">Current Rate (%)</Label>
                <Input
                  id="currentRate"
                  name="currentRate"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="rateType">Rate Type</Label>
                <Input id="rateType" name="rateType" type="select">
                  <option value="">Select...</option>
                  <option value="UNKNOWN">Unknown</option>
                  <option value="FIXED">Fixed</option>
                  <option value="VARIABLE">Variable</option>
                  <option value="TRACKER">Tracker</option>
                  <option value="LIBOR_LINKED">Libor Linked</option>
                  <option value="DISCOUNT">Discount</option>
                  <option value="CAPPED">Capped</option>
                  <option value="ALL">All</option>
                  <option value="SVR">SVR</option>
                  <option value="OFFSET">Offset</option>
                  <option value="LIFETIME">Lifetime</option>
                  <option value="OTHER">Other</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="toBeRepaid">To Be Repaid</Label>
                <Input
                  id="toBeRepaid"
                  name="toBeRepaid"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="currentRateEndDate">Current Rate End Date</Label>
                <Input
                  id="currentRateEndDate"
                  name="currentRateEndDate"
                  type="date"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ercEndDate">ERC End Date</Label>
                <Input id="ercEndDate" name="ercEndDate" type="date" />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="accountNumber">Account Number</Label>
                <Input id="accountNumber" name="accountNumber" type="text" />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="propertyType">Property Type*</Label>
                <Input
                  id="propertyType"
                  name="propertyType"
                  type="text"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="ownership">Ownership*</Label>
                <Input id="ownership" name="ownership" type="text" required />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="leasehold">Leasehold</Label>
                <Input
                  id="leasehold"
                  name="leasehold"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  onInput={limitDecimalPlaces}
                  placeholder="Years"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="yearBuilt">Year Built</Label>
                <Input id="yearBuilt" name="yearBuilt" type="number" step="1" />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="numberOfBedrooms">Number of Bedrooms*</Label>
                <Input
                  id="numberOfBedrooms"
                  name="numberOfBedrooms"
                  type="number"
                  step="1"
                  required
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="remainingMortgageTerm">
                  Remaining Mortgage Term
                </Label>
                <Input
                  id="remainingMortgageTerm"
                  name="remainingMortgageTerm"
                  type="number"
                  step="1"
                  placeholder="Years"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="isLimitedCompany"
                    className="border-primary"
                  />
                  Is Limited Company
                </Label>
              </FormGroup>
            </Col>            
            <Col md={4}>
              <FormGroup>
                <Label for="epcRating">EPC Rating</Label>
                <Input 
                  id="epcRating" 
                  name="epcRating" 
                  type="text"
                  value={fetchedEpcRating}
                  onChange={(e) => setFetchedEpcRating(e.target.value)} 
                  placeholder={isEpcLoading ? "Fetching..." : "e.g. C"}
                />
                { address1 && !fetchedEpcRating && !isEpcLoading && (
                  <small className="text-danger" style={{ marginTop: "5px", display: "block" }}>
                    No EPC rating found for this address.
                  </small>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <FormGroup>
                <Label for="note">Note</Label>
                <Input id="note" name="note" type="textarea" rows={3} />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end gap-2">
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={isAddPropertiesLoading}
              >
                {isAddPropertiesLoading ? "Adding..." : "Add Property"}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <GetAddressModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </Modal>
  );
};

export default AddPropertyModal;
