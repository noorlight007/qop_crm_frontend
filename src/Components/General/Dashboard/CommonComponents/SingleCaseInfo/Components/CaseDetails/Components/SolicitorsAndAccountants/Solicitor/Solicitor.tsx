import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useAssignCaseSolicitorMutation,
  useGetCaseSolicitorDetailsQuery,
  useGetSolicitorDetailsQuery,
  useUpdateSolicitorDetailsMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SolicitorAndAccountant/SolicitorAndAccountantApi";
import LoadingSpinner from "@/app/loading";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
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
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";
import AddSolicitorModal from "../Modals/AddSolicitorModal";

const Solicitor: React.FC = () => {
  const params = useParams();
  const { casealias } = params;
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const submitActionRef = useRef<"save" | "next">("save");
  const formRef = useRef<HTMLFormElement>(null);

  // RTK Hooks
  const { data: solicitorName, isLoading } =
    useGetSolicitorDetailsQuery(undefined);
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );
  const { data: caseSolicitors, isLoading: isCaseSolicitorLoading } =
    useGetCaseSolicitorDetailsQuery({ case_alias: casealias });
  console.log("caseSolicitors length:", caseSolicitors?.length);
  const [assignCaseSolicitor, { isLoading: isAssignedLoading }] =
    useAssignCaseSolicitorMutation();
  const [updateSolicitorDetails, { isLoading: isUpdateLoading }] =
    useUpdateSolicitorDetailsMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSolicitor, setSelectedSolicitor] = useState<any>(null);
  const [selectedCaseSolicitor, setSelectedCaseSolicitor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("0");
  // Add state for form fields
  const [formData, setFormData] = useState<any>({});

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
        (s: any) => s.id === caseSolicitor?.solicitor_details?.id
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
        (s: any) => s.id === caseSolicitors[validIndex]?.solicitor_details?.id
      );
      setFormData(solicitorDetails || {});
    }
  }, [caseSolicitors, solicitorName]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignSolicitor = async () => {
    if (!selectedSolicitor) {
      toast.error("Please select a solicitor first");
      return;
    }

    try {
      await assignCaseSolicitor({
        case_alias: casealias,
        solicitor: { solicitor: selectedSolicitor.id },
      }).unwrap();

      setSelectedSolicitor(null);
      Swal.fire("Success", "Solicitor assigned successfully!", "success");
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
      toast.success("Solicitor details updated successfully!");
      // Only go to next tab if this was a Save & Next action
      if (submitActionRef.current === "next") {
        handleNextTab();
      }
    } catch (error) {
      console.error("Failed to update solicitor details:", error);
      toast.error("Failed to update solicitor details. Please try again.");
    }
  };

  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(caseData?.case_stage, currentTab!);
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
                            {selectedCaseSolicitor.solicitor_details
                              .user_type || "N/A"}
                          </div>
                        </>
                      ) : (
                        <strong className="text-danger fs-4">
                          "Not Selected Yet!"
                        </strong>
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
                <Col md={6}>
                  <FormGroup>
                    <Label for="qualifications">Qualification*</Label>
                    <Input
                      id="qualifications"
                      name="qualifications"
                      type="text"
                      value={formData.qualifications || ""}
                      onChange={handleInputChange}
                      required
                    />
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
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label for="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      className="border-primary"
                      type="text"
                      value={formData.postcode || ""}
                      onChange={handleInputChange}
                    />
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
    </>
  );
};

export default Solicitor;
