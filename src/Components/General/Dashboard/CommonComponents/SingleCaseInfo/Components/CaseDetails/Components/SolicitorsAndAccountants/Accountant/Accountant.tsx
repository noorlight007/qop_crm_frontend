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
  Label,
  Row,
} from "reactstrap";

import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useAssignCaseAccountantMutation,
  useGetAccountantDetailsQuery,
  useGetCaseAccountantDetailsQuery,
  useUnassignAccountantMutation,
  useUpdateAccountantDetailsMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SolicitorAndAccountant/SolicitorAndAccountantApi";
import formatChoiceFieldValue from "@/utils/formatters";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { BiSolidErrorCircle } from "react-icons/bi";
import Swal from "sweetalert2";
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
  const [activeTab, setActiveTab] = useState<string>("0");
  const dispatch = useAppDispatch();

  // RTK Hooks
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: caseAlias },
    { skip: !caseAlias }
  );

  const { data: accountantName, isLoading: isAccountantLoading } =
    useGetAccountantDetailsQuery(undefined);
  const { data: caseAccountants, isLoading: isCaseAccountantLoading } =
    useGetCaseAccountantDetailsQuery({ case_alias: caseAlias });
  const [assignCaseAccountant, { isLoading: isAssigningLoading }] =
    useAssignCaseAccountantMutation();
  const [updateAccountant, { isLoading: isUpdatingLoading }] =
    useUpdateAccountantDetailsMutation();
  const [unassignAccountant, { isLoading: isUnassigning }] =
    useUnassignAccountantMutation();

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
        (a: any) => a.id === selectedCaseAccountant.accountant_details.id
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
        (a: any) => a.id === caseAccountants[validIndex]?.accountant_details?.id
      );
      setFormData(accountantDetails || {});
    }
  }, [caseAccountants, accountantName]);

  // Add handleInputChange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
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
      toast.success("Accountant details updated successfully!");
      // Only go to next tab if this was a Save & Next action
      if (submitActionRef.current === "next") {
        handleNextTab();
      }
    } catch (error) {
      console.error("Failed to update accountant details:", error);
      toast.error("Failed to update accountant details. Please try again.");
    }
  };
  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!
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
                  disabled={session?.user?.user_type === "CLIENT"}
                >
                  Add New Accountant
                </Button>
                <Button
                  color="primary"
                  onClick={handleAssignAccountant}
                  disabled={
                    !selectedAccountant ||
                    isAccountantAssigned() ||
                    session?.user?.user_type === "CLIENT"
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
                      selectedCaseAccountant.accountant_details.user_type
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
                              "success"
                            );
                            // Clear selection; RTK invalidation will refetch data
                            setSelectedCaseAccountant(null);
                          } catch (err) {
                            console.error(
                              "Failed to unassign accountant:",
                              err
                            );
                            Swal.fire(
                              "Error",
                              "Failed to unassign accountant. Please try again.",
                              "error"
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
                <strong className="text-danger fs-4">
                  "Not Selected Yet!"
                </strong>
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
              <Col md={4}>
                <FormGroup>
                  <Label for="name">Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    required
                  />
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
                  <Label for="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number || ""}
                    onChange={handleInputChange}
                  />
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
                      isUpdatingLoading || session?.user?.user_type === "CLIENT"
                    }
                  >
                    {isUpdatingLoading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    color="secondary"
                    type="submit"
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
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </form>

      <AddAccountantModal isOpen={isModalOpen} toggle={toggleModal} />
    </>
  );
};

export default Accountant;
