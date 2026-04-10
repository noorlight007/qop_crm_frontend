import LoadingSpinner from "@/app/loading";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from "reactstrap";

import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useAssignCaseAccountantMutation,
  useGetAccountantDetailsQuery,
  useGetCaseAccountantDetailsQuery,
  useUnassignAccountantMutation,
  useUpdateAccountantDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SolicitorAndAccountant/SolicitorAndAccountantApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { apiAddress } from "@/services/third-party-api";
import formatChoiceFieldValue from "@/utils/formatters";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { BiSolidErrorCircle } from "react-icons/bi";
import Swal from "sweetalert2";
import GetAddressModal from "../../../CommonModals/GetAddressModal";
import AddAccountantModal from "../Modals/AddAccountantModal";

const Accountant: React.FC = () => {
  const params = useParams();
  const { casealias } = params as { casealias?: string | string[] };
  const caseAlias = Array.isArray(casealias) ? casealias[0] : casealias;
  const { data: session } = useSession();
  const submitActionRef = useRef<"save" | "next">("save");
  const formRef = useRef<HTMLFormElement>(null);

  const [selectedAccountant, setSelectedAccountant] = useState<any>(null);
  const [selectedCaseAccountant, setSelectedCaseAccountant] =
    useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("0");
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const toggleAddressModal = () => setIsAddressModalOpen(!isAddressModalOpen);
  const dispatch = useAppDispatch();

  // RTK Hooks
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: caseAlias },
    { skip: !caseAlias },
  );

  const { data: accountantName, isLoading: isAccountantLoading } =
    useGetAccountantDetailsQuery(undefined);
  console.log("TEST::", accountantName);
  const { data: caseAccountants, isLoading: isCaseAccountantLoading } =
    useGetCaseAccountantDetailsQuery({ case_alias: caseAlias });
  const [assignCaseAccountant, { isLoading: isAssigningLoading }] =
    useAssignCaseAccountantMutation();
  const [updateAccountant, { isLoading: isUpdatingLoading }] =
    useUpdateAccountantDetailsMutation();
  const [unassignAccountant, { isLoading: isUnassigning }] =
    useUnassignAccountantMutation();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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

  const handleAccountantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    if (selectedId === selectedCaseAccountant?.accountant_details?.id) {
      setSelectedAccountant(null);
    } else {
      const accountant = accountantName?.find((a: any) => a.id == selectedId);
      setSelectedAccountant(accountant);
    }
  };

  const handleAssignAccountant = async () => {
    if (!selectedAccountant) {
      toast.error("Please select an accountant first");
      return;
    }

    try {
      await assignCaseAccountant({
        case_alias: caseAlias,
        accountant: { accountant: selectedAccountant?.id },
      }).unwrap();

      setSelectedAccountant(null);
      Swal.fire("Success!", "Accountant assigned successfully!", "success");
    } catch (error) {
      console.error("Failed to assign accountant:", error);
      toast.error("Failed to assign accountant. Please try again.");
    }
  };

  // Set initial case accountant
  useEffect(() => {
    if (caseAccountants && caseAccountants.length > 0) {
      setSelectedCaseAccountant(caseAccountants[0]);
    }
  }, [caseAccountants]);

  // Add this helper function
  const isAccountantAssigned = () => {
    return caseAccountants && caseAccountants.length > 0;
  };

  // Add this helper function to get the selected value
  const getSelectedAccountantValue = () => {
    if (selectedCaseAccountant?.accountant_details?.id && accountantName) {
      const matchingAccountant = accountantName.find(
        (a: any) => a.id === selectedCaseAccountant.accountant_details.id,
      );
      return matchingAccountant?.id || "";
    }
    return selectedAccountant?.id || "";
  };

  useEffect(() => {
    if (caseAccountants && caseAccountants.length > 0) {
      const currentTabIndex = parseInt(activeTab);
      const validIndex =
        currentTabIndex < caseAccountants.length ? currentTabIndex : 0;

      setActiveTab(validIndex.toString());
      setSelectedCaseAccountant(caseAccountants[validIndex]);

      const accountantDetails = accountantName?.find(
        (a: any) =>
          a.id === caseAccountants[validIndex]?.accountant_details?.id,
      );
      // setFormData(accountantDetails || {});

      if (accountantDetails) {
        setFormData(accountantDetails);

        if (accountantDetails.latitude && accountantDetails.longitude) {
          const lat = Number(accountantDetails.latitude);
          const lng = Number(accountantDetails.longitude);
          setMapCoords(lat !== 0 ? { lat, lng } : null);
        } else {
          setMapCoords(null);
        }
      } else {
        setFormData({});
        setMapCoords(null);
      }
    } else {
      setFormData({});
      setMapCoords(null);
    }
  }, [caseAccountants, accountantName]);

  // Add handleInputChange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
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

  // Update handleUpdateAccountant function
  const handleUpdateAccountant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseAccountant?.accountant_details?.id) {
      toast.error("Please select an accountant to update");
      return;
    }

    try {
      const updatePayload = {
        id: selectedCaseAccountant.accountant_details.id,
        ...formData,
      };

      await updateAccountant({
        alias: selectedCaseAccountant.accountant_details.alias,
        data: updatePayload,
      }).unwrap();

      // Update local state with new data
      const updatedAccountant = { ...selectedCaseAccountant };
      updatedAccountant.accountant_details = {
        ...updatedAccountant.accountant_details,
        ...formData,
      };

      setSelectedCaseAccountant(updatedAccountant);
      setErrors({});
      toast.success("Accountant details updated successfully!");
      // Only go to next tab if this was a Save & Next action
      if (submitActionRef.current === "next") {
        handleNextTab();
      }
    } catch (error) {
      console.error("Failed to update accountant details:", error);
      const parsed = parseApiErrors(
        (error as any)?.data || (error as any)?.response || error,
      );
      setErrors(parsed);
      const first =
        Object.values(parsed)[0] ||
        "Failed to update accountant details. Please try again.";
      toast.error(String(first));
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

  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  if (
    isAccountantLoading ||
    isCaseAccountantLoading ||
    isAssigningLoading ||
    isUpdatingLoading
  ) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  // Update the return section
  return (
    <>
      <Row>
        <Col md={6}>
          <Form>
            <Row>
              <FormGroup>
                <Label for="assignAccountant">Assign Accountant:</Label>

                <Input
                  id="assignAccountant"
                  name="assignAccountant"
                  type="select"
                  value={getSelectedAccountantValue()}
                  onChange={handleAccountantChange}
                  disabled={isAccountantAssigned()}
                >
                  <option value="">Select Accountant...</option>
                  {accountantName?.map((accountant: any) => (
                    <option key={accountant?.id} value={accountant?.id}>
                      {accountant?.name}
                    </option>
                  ))}
                </Input>
                <small className="text-muted text-danger">
                  {isAccountantAssigned()
                    ? "An accountant has already been assigned to this case."
                    : "Note: Please select and assign an accountant from the dropdown list. If the accountant is not listed, please add a new accountant."}
                </small>
              </FormGroup>
            </Row>
            <Row>
              <Col
                md={12}
                className="d-flex justify-content-between align-content-center gap-3"
              >
                <Button
                  color="success"
                  onClick={toggleModal}
                  className="border-success"
                  disabled={session?.user?.role === "APPLICANT"}
                >
                  Add New Accountant
                </Button>
                <Button
                  color="primary"
                  onClick={handleAssignAccountant}
                  disabled={
                    !selectedAccountant ||
                    isAccountantAssigned() ||
                    session?.user?.role === "APPLICANT"
                  }
                >
                  Assign Accountant
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={6}>
          <Card className="border-primary rounded-b-3 mt-4 m-0">
            <CardHeader className="bg-primary">
              <span className="fs-6 text-center">Selected Accountant</span>
            </CardHeader>
            <CardBody className="text-center">
              {selectedCaseAccountant?.accountant_details ? (
                <>
                  <div>
                    <strong>Name: </strong>
                    {selectedCaseAccountant.accountant_details.name || "N/A"}
                  </div>
                  <div>
                    <strong>Type: </strong>
                    {formatChoiceFieldValue(
                      selectedCaseAccountant.accountant_details.user_type,
                    ) || "N/A"}
                  </div>
                  <div className="mt-2">
                    <Button
                      color="danger"
                      outline
                      size="sm"
                      disabled={isUnassigning}
                      onClick={async (e) => {
                        e.stopPropagation();
                        const result = await Swal.fire({
                          title: "Are you sure?",
                          text: "This will unassign the accountant from the case.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, unassign",
                          cancelButtonText: "Cancel",
                        });
                        if (result.isConfirmed) {
                          try {
                            await unassignAccountant({
                              case_alias: caseAlias,
                              accountant_alias: selectedCaseAccountant.alias,
                            }).unwrap();
                            Swal.fire(
                              "Unassigned!",
                              "Accountant has been unassigned.",
                              "success",
                            );
                            // Clear selection; RTK invalidation will refetch data
                            setSelectedCaseAccountant(null);
                          } catch (err) {
                            console.error(
                              "Failed to unassign accountant:",
                              err,
                            );
                            Swal.fire(
                              "Error",
                              "Failed to unassign accountant. Please try again.",
                              "error",
                            );
                          }
                        }
                      }}
                    >
                      <BiSolidErrorCircle size={15} />
                      Unassign
                    </Button>
                  </div>
                </>
              ) : (
                <em className="text-danger fs-4">"Not Assigned Yet!"</em>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <form
        ref={formRef}
        id="accountant-form"
        onSubmit={handleUpdateAccountant}
      >
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
                  <Label for="name">Name<span className="text-danger">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.name && (
                    <div className="text-danger">{errors.name}</div>
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
                    value={formData.qualifications || ""}
                    onChange={handleInputChange}
                  />
                  {errors.qualifications && (
                    <div className="text-danger">{errors.qualifications}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={formData.company_name || ""}
                    onChange={handleInputChange}
                  />
                  {errors.company_name && (
                    <div className="text-danger">{errors.company_name}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="postcode">Postcode<span className="text-danger">*</span></Label>
                  <InputGroup className="d-flex align-items-center gap-2">
                    <Input
                      id="postcode"
                      type="text"
                      name="postcode"
                      className="rounded"
                      value={formData.postcode || ""}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      color="primary"
                      type="button"
                      className="text-nowrap"
                      style={{ paddingTop: "0.7rem", paddingBottom: "0.7rem" }}
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
              <Col md={6}>
                <FormGroup>
                  <Label for="building_name_or_number">
                    Building Name or Number
                  </Label>
                  <Input
                    id="building_name_or_number"
                    name="building_name_or_number"
                    type="text"
                    value={formData.building_name_or_number || ""}
                    onChange={handleInputChange}
                  />
                  {errors.building_name_or_number && (
                    <div className="text-danger">
                      {errors.building_name_or_number}
                    </div>
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
                    value={formData.city || ""}
                    onChange={handleInputChange}
                  />
                  {errors.city && (
                    <div className="text-danger">{errors.city}</div>
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
                    value={formData.street || ""}
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
                  <Label for="county">County</Label>
                  <Input
                    id="county"
                    name="county"
                    type="text"
                    value={formData.county || ""}
                    onChange={handleInputChange}
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
                    value={formData.country || ""}
                    onChange={handleInputChange}
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
                  <Label for="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number || ""}
                    onChange={handleInputChange}
                  />
                  {errors.phone_number && (
                    <div className="text-danger">{errors.phone_number}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="fax_number">Fax Number</Label>
                  <Input
                    id="fax_number"
                    name="fax_number"
                    type="tel"
                    value={formData.fax_number || ""}
                    onChange={handleInputChange}
                  />
                  {errors.fax_number && (
                    <div className="text-danger">{errors.fax_number}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="email_address">Email Address</Label>
                  <Input
                    id="email_address"
                    name="email_address"
                    type="email"
                    value={formData.email_address || ""}
                    onChange={handleInputChange}
                  />
                  {errors.email_address && (
                    <div className="text-danger">{errors.email_address}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <FormGroup className="d-flex justify-content-end gap-3">
                  <Button
                    color="primary"
                    type="submit"
                    onClick={() => {
                      submitActionRef.current = "save";
                    }}
                    disabled={
                      isUpdatingLoading || session?.user?.role === "APPLICANT"
                    }
                  >
                    {isUpdatingLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    color="secondary"
                    type="submit"
                    onClick={async (e) => {
                      if (session?.user?.role === "APPLICANT") {
                        handleNextTab();
                      } else {
                        e.preventDefault();
                        submitActionRef.current = "next";
                        formRef.current?.requestSubmit();
                      }
                    }}
                  >
                    {session?.user?.role === "APPLICANT"
                      ? "Go To Next"
                      : "Save & Next"}
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </form>

      <AddAccountantModal isOpen={isModalOpen} toggle={toggleModal} />
      <GetAddressModal
        isOpen={isAddressModalOpen}
        toggle={toggleAddressModal}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </>
  );
};

export default Accountant;
