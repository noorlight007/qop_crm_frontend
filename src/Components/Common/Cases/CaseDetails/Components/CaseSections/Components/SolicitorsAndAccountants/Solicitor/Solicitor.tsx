import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import {
  useAssignCaseSolicitorMutation,
  useGetCaseSolicitorDetailsQuery,
  useGetSolicitorDetailsQuery,
  useUnassignSolicitorMutation,
  useUpdateSolicitorDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SolicitorAndAccountant/SolicitorAndAccountantApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import LoadingSpinner from "@/app/loading";
import { apiAddress } from "@/services/third-party-api";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import formatChoiceFieldValue from "@/utils/formatters";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiSolidErrorCircle } from "react-icons/bi";
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
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import GetAddressModal from "../../../CommonModals/GetAddressModal";
import AddSolicitorModal from "../Modals/AddSolicitorModal";

const Solicitor: React.FC = () => {
  const params = useParams();
  const { casealias } = params as { casealias?: string | string[] };
  const caseAlias = Array.isArray(casealias) ? casealias[0] : casealias;
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const submitActionRef = useRef<"save" | "next">("save");
  const formRef = useRef<HTMLFormElement>(null);

  // RTK Hooks
  const { data: solicitorName, isLoading } =
    useGetSolicitorDetailsQuery(undefined);

  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: caseAlias },
    { skip: !caseAlias },
  );
  const { data: caseSolicitors, isLoading: isCaseSolicitorLoading } =
    useGetCaseSolicitorDetailsQuery({ case_alias: caseAlias });

  const [assignCaseSolicitor, { isLoading: isAssignedLoading }] =
    useAssignCaseSolicitorMutation();
  const [unassignSolicitor, { isLoading: isUnassigning }] =
    useUnassignSolicitorMutation();
  const [updateSolicitorDetails, { isLoading: isUpdateLoading }] =
    useUpdateSolicitorDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitor, setSelectedSolicitor] = useState<any>(null);
  const [selectedCaseSolicitor, setSelectedCaseSolicitor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("0");
  // Add state for form fields
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSearchingPostcode, setIsSearchingPostcode] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const toggleAddressModal = () => setIsAddressModalOpen(!isAddressModalOpen);

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

  const handleSolicitorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    if (selectedId === selectedCaseSolicitor?.solicitor_details?.id) {
      setSelectedSolicitor(null); // Clear selection if selecting current solicitor
    } else {
      const solicitor = solicitorName?.find((s: any) => s.id == selectedId);
      setSelectedSolicitor(solicitor);
    }
  };

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      const caseSolicitor = caseSolicitors?.[parseInt(tab)];
      setSelectedCaseSolicitor(caseSolicitor);
      setSelectedSolicitor(null); // Reset selected solicitor when changing tabs

      // Update form data when tab changes
      const solicitorDetails = solicitorName?.find(
        (s: any) => s.id === caseSolicitor?.solicitor_details?.id,
      );
      setFormData(solicitorDetails || {});
    }
  };

  useEffect(() => {
    if (caseSolicitors && caseSolicitors.length > 0) {
      // Get current tab index or default to 0
      const currentTabIndex = parseInt(activeTab);
      const validIndex =
        currentTabIndex < caseSolicitors.length ? currentTabIndex : 0;

      setActiveTab(validIndex.toString());
      setSelectedCaseSolicitor(caseSolicitors[validIndex]);

      const solicitorDetails = solicitorName?.find(
        (s: any) => s.id === caseSolicitors[validIndex]?.solicitor_details?.id,
      );

      if (solicitorDetails) {
        setFormData(solicitorDetails);

        if (solicitorDetails.latitude && solicitorDetails.longitude) {
          const lat = Number(solicitorDetails.latitude);
          const lng = Number(solicitorDetails.longitude);
          setMapCoords(lat !== 0 ? { lat, lng } : null);
        } else {
          setMapCoords(null);
        }
      } else {
        setFormData({});
        setMapCoords(null);
      }
    } else {
      setSelectedCaseSolicitor(null);
      setFormData({});
      setMapCoords(null);
    }
  }, [caseSolicitors, solicitorName, activeTab]);

  // Handle form input changes
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

  const handleAssignSolicitor = async () => {
    if (!selectedSolicitor) {
      toast.error("Please select a solicitor first");
      return;
    }

    try {
      await assignCaseSolicitor({
        case_alias: caseAlias,
        solicitor: { solicitor: selectedSolicitor.id },
      }).unwrap();

      setSelectedSolicitor(null);
      Swal.fire("Success", "Solicitor assigned successfully!", "success");
      try {
        await updateSectionCompleteStatus({
          case_alias: caseAlias,
          section_data: { is_solicitors_accountants: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }
    } catch (error) {
      console.error("Failed to assign solicitor:", error);
      toast.error("Failed to assign solicitor. Please try again.");
    }
  };

  // Implement handleUpdateSolicitorDetails
  const handleUpdateSolicitorDetails = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!selectedCaseSolicitor?.solicitor_details?.id) {
      toast.error("Please select a solicitor to update");
      return;
    }

    try {
      const updatePayload = {
        id: selectedCaseSolicitor.solicitor_details.id,
        ...formData,
      };

      const result = await updateSolicitorDetails({
        solicitor_alias: selectedCaseSolicitor.solicitor_details.alias,
        updatedSolicitorDetails: updatePayload,
      }).unwrap();

      // Update local state with new data
      const updatedSolicitor = { ...selectedCaseSolicitor };
      updatedSolicitor.solicitor_details = {
        ...updatedSolicitor.solicitor_details,
        ...formData,
      };

      setSelectedCaseSolicitor(updatedSolicitor);
      setErrors({});
      toast.success("Solicitor details updated successfully!");
      try {
        await updateSectionCompleteStatus({
          case_alias: caseAlias,
          section_data: { is_solicitors_accountants: true },
        });
      } catch (err) {
        console.error("Failed to update section complete status:", err);
      }
      // Only go to next tab if this was a Save & Next action
      if (submitActionRef.current === "next") {
        handleNextTab();
      }
    } catch (error) {
      console.error("Failed to update solicitor details:", error);
      const parsed = parseApiErrors(
        (error as any)?.data || (error as any)?.response || error,
      );
      setErrors(parsed);
      const first =
        Object.values(parsed)[0] ||
        "Failed to update solicitor details. Please try again.";
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
    isLoading ||
    isCaseSolicitorLoading ||
    isAssignedLoading ||
    isUpdateLoading
  )
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <Card>
        <CardBody>
          {caseSolicitors && caseSolicitors.length > 0 && (
            <Nav
              tabs
              className="mb-3 d-flex justify-content-center align-items-center"
            >
              {caseSolicitors.map((caseSolicitor: any, index: number) => (
                <NavItem key={caseSolicitor.alias}>
                  <NavLink
                    className={`cursor-pointer ${
                      activeTab === index.toString()
                        ? "active text-primary"
                        : "text-secondary"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleTab(index.toString())}
                  >
                    Solicitor {index + 1}
                  </NavLink>
                </NavItem>
              ))}
            </Nav>
          )}

          <Row>
            <Col md={12}>
              <Row>
                <Col md={6}>
                  <Form>
                    <Row>
                      <FormGroup>
                        <Label for="assignSolicitor">Assign Solicitor:</Label>
                        <Input
                          id="assignSolicitor"
                          name="assignSolicitor"
                          type="select"
                          value={
                            selectedSolicitor?.id ||
                            selectedCaseSolicitor?.solicitor_details?.id ||
                            ""
                          }
                          onChange={handleSolicitorChange}
                        >
                          <option value="">Select Solicitor...</option>
                          {solicitorName?.map((solicitor: any) => (
                            <option key={solicitor?.id} value={solicitor?.id}>
                              {solicitor?.name}
                              {solicitor?.id ===
                              selectedCaseSolicitor?.solicitor_details?.id
                                ? " (Currently Assigned)"
                                : ""}
                            </option>
                          ))}
                        </Input>
                        <small className="text-muted text-danger">
                          Note: Please select and assigned a solicitor from the
                          dropdown list. If the solicitor is not listed, please
                          add a new solicitor.
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
                          disabled={session?.user?.user_type === "CLIENT"}
                        >
                          Add New Solicitor
                        </Button>
                        <Button
                          color="primary"
                          onClick={handleAssignSolicitor}
                          disabled={
                            !selectedSolicitor ||
                            session?.user?.user_type === "CLIENT"
                          }
                        >
                          Assign Solicitor
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col md={6}>
                  <Card className="border-primary rounded-b-3 mt-4 m-0">
                    <CardHeader className="bg-primary">
                      <span className="fs-6 text-center">
                        Selected Solicitor
                      </span>
                    </CardHeader>
                    <CardBody className="text-center">
                      {selectedCaseSolicitor?.solicitor_details ? (
                        <>
                          <div>
                            <strong>Name: </strong>
                            {selectedCaseSolicitor.solicitor_details.name ||
                              "N/A"}
                          </div>
                          <div>
                            <strong>Type: </strong>
                            {formatChoiceFieldValue(
                              selectedCaseSolicitor.solicitor_details.user_type,
                            ) || "N/A"}
                          </div>
                          <div>
                            <Button
                              outline
                              size="sm"
                              color="danger"
                              className="ms-1"
                              title="Unassign"
                              disabled={isUnassigning}
                              onClick={async (e) => {
                                e.stopPropagation();
                                const result = await Swal.fire({
                                  title: "Are you sure?",
                                  text: "This will unassign the solicitor from the case.",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, unassign",
                                  cancelButtonText: "Cancel",
                                });
                                if (result.isConfirmed) {
                                  try {
                                    await unassignSolicitor({
                                      case_alias: caseAlias,
                                      solicitor_alias:
                                        selectedCaseSolicitor?.alias,
                                    }).unwrap();
                                    Swal.fire(
                                      "Unassigned!",
                                      "Solicitor has been unassigned.",
                                      "success",
                                    );
                                    // Clear selection and reset active tab
                                    setSelectedCaseSolicitor(null);
                                    setActiveTab("0");
                                  } catch (err) {
                                    console.error(
                                      "Failed to unassign solicitor:",
                                      err,
                                    );
                                    Swal.fire(
                                      "Error",
                                      "Failed to unassign solicitor. Please try again.",
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
                        <em className="text-danger fs-4">
                          "Not Assigned Yet!"
                        </em>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <hr />

          <Row>
            <form
              ref={formRef}
              id="solicitor-form"
              onSubmit={handleUpdateSolicitorDetails}
            >
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="qualifications">Qualification<span className="text-danger">*</span></Label>
                    <Input
                      id="qualifications"
                      name="qualifications"
                      type="text"
                      value={formData.qualifications || ""}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.qualifications && (
                      <div className="text-danger">{errors.qualifications}</div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="sraNumber">SRA Number</Label>
                    <Input
                      id="sraNumber"
                      name="sra_number"
                      type="text"
                      value={formData.sra_number || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.sra_number || errors.sraNumber) && (
                      <div className="text-danger">
                        {errors.sra_number || errors.sraNumber}
                      </div>
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
                        style={{
                          paddingTop: "0.7rem",
                          paddingBottom: "0.7rem",
                        }}
                        onClick={() =>
                          fetchAddressByPostcode(formData.postcode)
                        }
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
                      name="building_name_or_number"
                      type="text"
                      value={formData.building_name_or_number || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.building_name_or_number ||
                      errors.buildingName) && (
                      <div className="text-danger">
                        {errors.building_name_or_number || errors.buildingName}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
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
                    <Label for="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.phone_number || errors.phoneNumber) && (
                      <div className="text-danger">
                        {errors.phone_number || errors.phoneNumber}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="faxNumber">Fax Number</Label>
                    <Input
                      id="faxNumber"
                      name="fax_number"
                      type="tel"
                      value={formData.fax_number || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.fax_number || errors.faxNumber) && (
                      <div className="text-danger">
                        {errors.fax_number || errors.faxNumber}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="dxNumber">DX Number</Label>
                    <Input
                      id="dxNumber"
                      name="dx_number"
                      type="text"
                      value={formData.dx_number || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.dx_number || errors.dxNumber) && (
                      <div className="text-danger">
                        {errors.dx_number || errors.dxNumber}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      name="contact_name"
                      type="text"
                      value={formData.contact_name || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.contact_name || errors.contactName) && (
                      <div className="text-danger">
                        {errors.contact_name || errors.contactName}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      name="email_address"
                      type="email"
                      value={formData.email_address || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.email_address || errors.emailAddress) && (
                      <div className="text-danger">
                        {errors.email_address || errors.emailAddress}
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
                      name="number_of_partners_in_firm"
                      type="number"
                      value={formData.number_of_partners_in_firm || ""}
                      onChange={handleInputChange}
                    />
                    {(errors.number_of_partners_in_firm ||
                      errors.numberOfPartners) && (
                      <div className="text-danger">
                        {errors.number_of_partners_in_firm ||
                          errors.numberOfPartners}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={12} className="d-flex justify-content-end gap-3">
                  <Button
                    type="submit"
                    color="primary"
                    disabled={
                      isUpdateLoading || session?.user?.user_type === "CLIENT"
                    }
                    onClick={() => {
                      submitActionRef.current = "save";
                    }}
                  >
                    {isUpdateLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    color="secondary"
                    onClick={async (e) => {
                      if (session?.user?.user_type === "CLIENT") {
                        handleNextTab();
                      } else {
                        e.preventDefault();
                        submitActionRef.current = "next";
                        formRef.current?.requestSubmit();
                      }
                    }}
                  >
                    {session?.user?.user_type === "CLIENT"
                      ? "Go To Next"
                      : "Save & Next"}
                  </Button>
                </Col>
              </Row>
            </form>
          </Row>
        </CardBody>
      </Card>

      <AddSolicitorModal isOpen={isModalOpen} toggle={toggleModal} />
      <GetAddressModal
        isOpen={isAddressModalOpen}
        toggle={toggleAddressModal}
        addresses={addressList}
        onSelect={handleSelectAddress}
      />
    </>
  );
};

export default Solicitor;
