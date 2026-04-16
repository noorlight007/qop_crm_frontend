"use client";
import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";

import {
  useGetSingleAdverseDetailsQuery,
  useUpdateAdverseDetailsMutation,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/AdverseDetails/AdverseDetailsApi";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { ApplicantsUsersProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/ApplicantsUserTypes";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import AddNewBankruptciesModal from "./AdverseModals/AddModals/AddNewBankruptciesModal";
import AddNewCommitmentPaymentsMissedModal from "./AdverseModals/AddModals/AddNewCommitmentPaymentsMissedModal";
import AddNewDefaultsModal from "./AdverseModals/AddModals/AddNewDefaultsModal";
import AddNewDMPsModal from "./AdverseModals/AddModals/AddNewDMPsModal";
import AddNewIVAsModal from "./AdverseModals/AddModals/AddNewIVAsModal";
import AddNewPayDayLoansModal from "./AdverseModals/AddModals/AddNewPayDayLoansModal";
import AddNewPropertiesRepossessedModal from "./AdverseModals/AddModals/AddNewPropertiesRepossessedModal";
import AddNewRegisteredCCJsModal from "./AdverseModals/AddModals/AddNewRegisteredccjsModal";
import ViewBankruptciesModal from "./AdverseModals/ViewModals/ViewBankruptciesModal";
import ViewCCJsModal from "./AdverseModals/ViewModals/ViewCCJsModal";
import ViewCommitmentPaymentsMissedModal from "./AdverseModals/ViewModals/ViewCommitmentPaymentsMissedModal";
import ViewDefaultsModal from "./AdverseModals/ViewModals/ViewDefaultsModal";
import ViewDMPsModal from "./AdverseModals/ViewModals/ViewDMPsModal";
import ViewIVAsModal from "./AdverseModals/ViewModals/ViewIVAsModal";
import ViewPayDayLoansModal from "./AdverseModals/ViewModals/ViewPayDayLoansModal";
import ViewPropertiesRepossessedModal from "./AdverseModals/ViewModals/ViewPropertiesRepossessedModal";

const AdverseTabContent: React.FC<ApplicantsUsersProps> = ({ basicTab }) => {
  const params = useParams();
  const { casealias } = params;
  const { data: session } = useSession();

  const { data, isLoading } = useGetSingleAdverseDetailsQuery({
    case_alias: casealias,
    adverse_alias: basicTab,
  });
  const [updateAdverseDetails, { isLoading: isAdverseUpdating }] =
    useUpdateAdverseDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const [formData, setFormData] = useState({
    alias: "",
    has_any_defaults_registered_in_the_last_six_years: false,
    has_any_ccj_registered_in_the_last_six_years: false,
    missed_any_payments_on_commitments_in_the_last_five_years: false,
    is_a_property_repossessed: false,
    has_ever_been_made_bankrupt: false,
    have_you_ever_entered_into_an_individual_voluntary_arrangement: false, // Add new field
    is_ever_enter_into_a_debt_management_plan_or_debt_relief_order: false,
    is_ever_taken_out_a_pay_day_loan: false,
    is_exceeded_your_overdraft_in_the_last_three_months: false,
    is_direct_debit_returned_in_the_last_three_months: false,
    why_did_the_adverse_occur: "",
    user: {
      id: 0,
      alias: "",
      email: "",
      phone: "",
      first_name: "",
      last_name: "",
      profile_image: null,
      user_type: "",
    },
  });

  // Log data to debug
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  // Handle radio button changes
  const handleRadioChange = (key: keyof typeof formData, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Modals state for add
  const [addNewDefaultsModal, setAddNewDefaultsModal] = useState(false);
  const [addNewCCJsModal, setAddNewCCJsModal] = useState(false);
  const [
    addNewCommitmentPaymentsMissedModal,
    setAddNewCommitmentPaymentsMissedModal,
  ] = useState(false);
  const [
    addNewPropertiesRepossessedModal,
    setAddNewPropertiesRepossessedModal,
  ] = useState(false);
  const [addNewBankruptciesModal, setAddNewBankruptciesModal] = useState(false);
  const [addNewIVAsModal, setAddNewIVAsModal] = useState(false);
  const [addNewDMPsModal, setAddNewDMPsModal] = useState(false);
  const [addNewPayDayLoansModal, setAddNewPayDayLoansModal] = useState(false);

  // Handle Add New button click
  const handleAddNewClick = (key: keyof typeof formData) => {
    switch (key) {
      case "has_any_defaults_registered_in_the_last_six_years":
        setAddNewDefaultsModal(true);
        break;
      case "has_any_ccj_registered_in_the_last_six_years":
        setAddNewCCJsModal(true);
        break;
      case "missed_any_payments_on_commitments_in_the_last_five_years":
        setAddNewCommitmentPaymentsMissedModal(true);
        break;
      case "is_a_property_repossessed":
        setAddNewPropertiesRepossessedModal(true);
        break;
      case "has_ever_been_made_bankrupt":
        setAddNewBankruptciesModal(true);
        break;
      case "have_you_ever_entered_into_an_individual_voluntary_arrangement":
        setAddNewIVAsModal(true);
        break;
      case "is_ever_enter_into_a_debt_management_plan_or_debt_relief_order":
        setAddNewDMPsModal(true);
        break;
      case "is_ever_taken_out_a_pay_day_loan":
        setAddNewPayDayLoansModal(true);
        break;
      default:
        break;
    }
  };

  // Add view modal states
  const [viewDefaultsModal, setViewDefaultsModal] = useState(false);
  const [viewCCJsModal, setViewCCJsModal] = useState(false);
  const [
    viewCommitmentPaymentsMissedModal,
    setViewCommitmentPaymentsMissedModal,
  ] = useState(false);
  const [viewPropertiesRepossessedModal, setViewPropertiesRepossessedModal] =
    useState(false);
  const [viewBankruptciesModal, setViewBankruptciesModal] = useState(false);
  const [viewIVAsModal, setViewIVAsModal] = useState(false);
  const [viewDMPsModal, setViewDMPsModal] = useState(false);
  const [viewPayDayLoansModal, setViewPayDayLoansModal] = useState(false);

  const [submitting, setSubmitting] = useState<"save" | "save_next" | null>(
    null,
  );

  // Add handle view button click
  const handleViewClick = (key: keyof typeof formData) => {
    switch (key) {
      case "has_any_defaults_registered_in_the_last_six_years":
        setViewDefaultsModal(true);
        break;
      case "has_any_ccj_registered_in_the_last_six_years":
        setViewCCJsModal(true);
        break;
      case "missed_any_payments_on_commitments_in_the_last_five_years":
        setViewCommitmentPaymentsMissedModal(true);
        break;
      case "is_a_property_repossessed":
        setViewPropertiesRepossessedModal(true);
        break;
      case "has_ever_been_made_bankrupt":
        setViewBankruptciesModal(true);
        break;
      case "have_you_ever_entered_into_an_individual_voluntary_arrangement":
        setViewIVAsModal(true);
        break;
      case "is_ever_enter_into_a_debt_management_plan_or_debt_relief_order":
        setViewDMPsModal(true);
        break;
      case "is_ever_taken_out_a_pay_day_loan":
        setViewPayDayLoansModal(true);
        break;
      default:
        break;
    }
  };
  // Add this function before the return statement
  const handleSubmit = async () => {
    try {
      const updatedFields = {
        has_any_defaults_registered_in_the_last_six_years:
          formData.has_any_defaults_registered_in_the_last_six_years,
        has_any_ccj_registered_in_the_last_six_years:
          formData.has_any_ccj_registered_in_the_last_six_years,
        missed_any_payments_on_commitments_in_the_last_five_years:
          formData.missed_any_payments_on_commitments_in_the_last_five_years,
        is_a_property_repossessed: formData.is_a_property_repossessed,
        has_ever_been_made_bankrupt: formData.has_ever_been_made_bankrupt,
        have_you_ever_entered_into_an_individual_voluntary_arrangement:
          formData.have_you_ever_entered_into_an_individual_voluntary_arrangement,
        is_ever_enter_into_a_debt_management_plan_or_debt_relief_order:
          formData.is_ever_enter_into_a_debt_management_plan_or_debt_relief_order,
        is_ever_taken_out_a_pay_day_loan:
          formData.is_ever_taken_out_a_pay_day_loan,
        is_exceeded_your_overdraft_in_the_last_three_months:
          formData.is_exceeded_your_overdraft_in_the_last_three_months,
        is_direct_debit_returned_in_the_last_three_months:
          formData.is_direct_debit_returned_in_the_last_three_months,
        why_did_the_adverse_occur: formData.why_did_the_adverse_occur,
        is_adverse: true,
      };

      const res = await updateAdverseDetails({
        case_alias: casealias,
        adverse_alias: basicTab,
        adverse_details: updatedFields,
      });

      if (res.data) {
        toast.success("Adverse updated successfully");
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_adverse: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
      } else if (res.error) {
        const errorMessage =
          (res.error as any)?.data?.detail ||
          "Failed to update adverse details!";
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(null);
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

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-sm border-0 rounded-lg p-4">
            <CardBody>
              <Form>
                <Row>
                  {[
                    {
                      key: "has_any_defaults_registered_in_the_last_six_years",
                      label: "Defaults registered in the last 6 years?",
                    },
                    {
                      key: "has_any_ccj_registered_in_the_last_six_years",
                      label: "CCJ's registered in the last 6 years?",
                    },
                    {
                      key: "missed_any_payments_on_commitments_in_the_last_five_years",
                      label: "Missed commitment payments in the last 5 years?",
                    },
                    {
                      key: "is_a_property_repossessed",
                      label: "Property repossessed?",
                    },
                    {
                      key: "has_ever_been_made_bankrupt",
                      label: "Ever been made bankrupt?",
                    },
                    {
                      key: "have_you_ever_entered_into_an_individual_voluntary_arrangement",
                      label:
                        "Ever entered into an Individual Voluntary Arrangement (IVA)?",
                    },
                    {
                      key: "is_ever_enter_into_a_debt_management_plan_or_debt_relief_order",
                      label: "Entered into a Debt Management Plan (DMP)?",
                    },
                    {
                      key: "is_ever_taken_out_a_pay_day_loan",
                      label: "Taken out a payday loan?",
                    },
                    {
                      key: "is_exceeded_your_overdraft_in_the_last_three_months",
                      label: "Exceeded overdraft in the last 3 months?",
                    },
                    {
                      key: "is_direct_debit_returned_in_the_last_three_months",
                      label:
                        "Had a direct debit returned in the last 3 months?",
                    },
                  ].map(({ key, label }) => (
                    <Col md={6} key={key} className="mb-3">
                      <FormGroup>
                        <Label>{label}</Label>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <Input
                              type="radio"
                              name={key}
                              onChange={() =>
                                handleRadioChange(
                                  key as keyof typeof formData,
                                  true,
                                )
                              }
                              checked={
                                formData[key as keyof typeof formData] === true
                              }
                            />{" "}
                            Yes
                            <Input
                              type="radio"
                              name={key}
                              className="ms-2"
                              onChange={() =>
                                handleRadioChange(
                                  key as keyof typeof formData,
                                  false,
                                )
                              }
                              checked={
                                formData[key as keyof typeof formData] === false
                              }
                            />{" "}
                            No
                          </div>
                        </div>
                        {formData[key as keyof typeof formData] === true &&
                          key !==
                            "is_exceeded_your_overdraft_in_the_last_three_months" &&
                          key !==
                            "is_direct_debit_returned_in_the_last_three_months" && (
                            <div className="d-flex gap-2 mt-2">
                              <Button
                                color="success"
                                onClick={() =>
                                  handleAddNewClick(
                                    key as keyof typeof formData,
                                  )
                                }
                              >
                                Add New
                              </Button>
                              <Button
                                color="primary"
                                onClick={() =>
                                  handleViewClick(key as keyof typeof formData)
                                }
                              >
                                View
                              </Button>
                            </div>
                          )}
                      </FormGroup>
                    </Col>
                  ))}
                </Row>

                <FormGroup>
                  <Label for="reasonForAdverse">
                    Why did the adverse occur?(If applicable)
                  </Label>
                  <Input
                    type="textarea"
                    name="why_did_the_adverse_occur"
                    id="why_did_the_adverse_occur"
                    value={formData.why_did_the_adverse_occur || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        why_did_the_adverse_occur: e.target.value,
                      }))
                    }
                    disabled={
                      !Object.entries(formData)
                        .filter(([key, value]) => typeof value === "boolean")
                        .some(([_, value]) => value === true)
                    }
                  />
                </FormGroup>

                {/* Submit Button */}
                <div className="d-flex justify-content-end mt-4 gap-2">
                  <Button
                    type="button"
                    color="primary"
                    onClick={async () => {
                      setSubmitting("save");
                      await handleSubmit();
                    }}
                    disabled={submitting !== null || isAdverseUpdating}
                  >
                    {submitting === "save" ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    color="secondary"
                    onClick={async (e) => {
                      if (session?.user?.role === "APPLICANT") {
                        handleNextTab();
                      } else {
                        e.preventDefault();
                        setSubmitting("save_next");
                        await handleSubmit();
                        handleNextTab();
                      }
                    }}
                    disabled={submitting !== null || isAdverseUpdating}
                  >
                    {session?.user?.role === "APPLICANT"
                      ? "Go To Next"
                      : submitting === "save_next"
                        ? "Saving..."
                        : "Save & Next"}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      {addNewDefaultsModal && (
        <AddNewDefaultsModal
          isOpen={addNewDefaultsModal}
          toggle={() => setAddNewDefaultsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {addNewCCJsModal && (
        <AddNewRegisteredCCJsModal
          isOpen={addNewCCJsModal}
          toggle={() => setAddNewCCJsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {addNewCommitmentPaymentsMissedModal && (
        <AddNewCommitmentPaymentsMissedModal
          isOpen={addNewCommitmentPaymentsMissedModal}
          toggle={() => setAddNewCommitmentPaymentsMissedModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {addNewPropertiesRepossessedModal && (
        <AddNewPropertiesRepossessedModal
          isOpen={addNewPropertiesRepossessedModal}
          toggle={() => setAddNewPropertiesRepossessedModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {addNewBankruptciesModal && (
        <AddNewBankruptciesModal
          isOpen={addNewBankruptciesModal}
          toggle={() => setAddNewBankruptciesModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {addNewIVAsModal && (
        <AddNewIVAsModal
          isOpen={addNewIVAsModal}
          toggle={() => setAddNewIVAsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {addNewDMPsModal && (
        <AddNewDMPsModal
          isOpen={addNewDMPsModal}
          toggle={() => setAddNewDMPsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {addNewPayDayLoansModal && (
        <AddNewPayDayLoansModal
          isOpen={addNewPayDayLoansModal}
          toggle={() => setAddNewPayDayLoansModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {/* View modals  */}
      {viewPropertiesRepossessedModal && (
        <ViewPropertiesRepossessedModal
          isOpen={viewPropertiesRepossessedModal}
          toggle={() => setViewPropertiesRepossessedModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}
      {viewCommitmentPaymentsMissedModal && (
        <ViewCommitmentPaymentsMissedModal
          isOpen={viewCommitmentPaymentsMissedModal}
          toggle={() => setViewCommitmentPaymentsMissedModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}
      {viewDefaultsModal && (
        <ViewDefaultsModal
          isOpen={viewDefaultsModal}
          toggle={() => setViewDefaultsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}
      {viewBankruptciesModal && (
        <ViewBankruptciesModal
          isOpen={viewBankruptciesModal}
          toggle={() => setViewBankruptciesModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}

      {viewIVAsModal && (
        <ViewIVAsModal
          isOpen={viewIVAsModal}
          toggle={() => setViewIVAsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}
      {viewDMPsModal && (
        <ViewDMPsModal
          isOpen={viewDMPsModal}
          toggle={() => setViewDMPsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}
      {viewPayDayLoansModal && (
        <ViewPayDayLoansModal
          isOpen={viewPayDayLoansModal}
          toggle={() => setViewPayDayLoansModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}
      {viewCCJsModal && (
        <ViewCCJsModal
          isOpen={viewCCJsModal}
          toggle={() => setViewCCJsModal((prev) => !prev)}
          adverseAlias={basicTab}
        />
      )}
    </Container>
  );
};

export default AdverseTabContent;
