import LoadingSpinner from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/CommonComponents/Cases/CasesApi";
import { basicTabIndicator } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CaseDetailsTabIndicatorSlice";
import {
  useGetClientSurveyQuery,
  useUpdateClientSurveyMutation,
} from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/ClientSurvey/ClientSurveyApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/SectionCompleteApi";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

// Enum values for backend
const ANSWER_OPTIONS = [
  { label: "Better than expected", value: "BETTER_THAN_EXPECTED" },
  { label: "As Expected", value: "AS_EXPECTED" },
  { label: "Below Expected", value: "BELOW_EXPECTED" },
  { label: "N/A", value: "N/A" },
  { label: "Not mentioned to me", value: "NOT_MENTIONED_TO_ME" },
];

const ClientSurveyContent: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();

  // RTK Queries
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias }
  );

  const {
    data: clientSurveyList, // Now an array
    isLoading: isSurveyLoading,
    isError,
  } = useGetClientSurveyQuery({ case_alias: casealias }, { skip: !casealias });

  const [updateClientSurvey, { isLoading: isUpdating }] =
    useUpdateClientSurveyMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  // Local form state
  const [clientSurvey, setClientSurvey] = React.useState<boolean>(false);
  const [adviserName, setAdviserName] = React.useState<string>("");
  const [question2, setQuestion2] = React.useState<string>("");
  const [question3, setQuestion3] = React.useState<string>("");
  const [question4, setQuestion4] = React.useState<string>("");
  const [question5, setQuestion5] = React.useState<string>("");
  const [question6, setQuestion6] = React.useState<string>("");
  const [question7, setQuestion7] = React.useState<string>("");
  const [question8, setQuestion8] = React.useState<string>("");
  const [question9, setQuestion9] = React.useState<string>("");
  const [question10, setQuestion10] = React.useState<string>("");
  const [question11, setQuestion11] = React.useState<string>("");
  const [question12, setQuestion12] = React.useState<string>("");
  const [question13, setQuestion13] = React.useState<string>("");
  const [question14, setQuestion14] = React.useState<string>("");
  const [question15, setQuestion15] = React.useState<string>("");
  const [question16, setQuestion16] = React.useState<string>("");
  const [question17, setQuestion17] = React.useState<string>("");
  const [question18, setQuestion18] = React.useState<string>("");
  const [question19, setQuestion19] = React.useState<string>("");
  const [question20, setQuestion20] = React.useState<string>("");
  const [question21, setQuestion21] = React.useState<string>("");
  const [question22, setQuestion22] = React.useState<string>("");
  const [question23, setQuestion23] = React.useState<string>("");
  const [question24, setQuestion24] = React.useState<string>("");
  const [question25, setQuestion25] = React.useState<string>("");
  const [question26, setQuestion26] = React.useState<string>("");
  const [question27, setQuestion27] = React.useState<string>("");
  const [question28, setQuestion28] = React.useState<string>("");
  const [question29, setQuestion29] = React.useState<string>("");
  const [question30, setQuestion30] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");

  // === STEP 1: Extract the Most Relevant Survey Record ===
  const selectedSurvey = useMemo(() => {
    if (!Array.isArray(clientSurveyList) || clientSurveyList.length === 0)
      return null;

    // Sort by creation date: newest first
    const sorted = [...clientSurveyList].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return sorted[0];
  }, [clientSurveyList]);

  // === STEP 2: Generate surveyAlias for update ===
  const surveyAlias = selectedSurvey?.alias || null;

  // === STEP 3: Sync form state when selectedSurvey changes ===
  useEffect(() => {
    if (selectedSurvey && typeof selectedSurvey === "object") {
      setClientSurvey(selectedSurvey.client_survey || false);
      setAdviserName(selectedSurvey.adviser_name || "");
      setQuestion2(
        selectedSurvey.is_clarification_explanation_of_the_service_firm || ""
      );
      setQuestion3(selectedSurvey.is_timely_service_delivery || "");
      setQuestion4(selectedSurvey.is_helpfulness_representative || "");
      setQuestion5(selectedSurvey.the_firm_offices_reason || "");
      setQuestion6(selectedSurvey.is_accuracy_information_provided || "");
      setQuestion7(selectedSurvey.is_clarification_explanation_paid || "");
      setQuestion8(selectedSurvey.is_raising_queries_relating_service || "");
      setQuestion9(
        selectedSurvey.is_clarification_explanation_protection_review || ""
      );
      setQuestion10(
        selectedSurvey.is_understanding_of_financial_objectives || ""
      );
      setQuestion11(
        selectedSurvey.is_explanation_consideration_of_attitude_risk || ""
      );
      setQuestion12(
        selectedSurvey.is_explanation_consideration_capacity_loss_of_capital ||
          ""
      );
      setQuestion13(selectedSurvey.is_explanation_adviser_product || "");
      setQuestion14(selectedSurvey.is_interaction_adviser_professionals || "");
      setQuestion15(selectedSurvey.is_suitable_advice_for_your_needs || "");
      setQuestion16(
        selectedSurvey.is_ability_of_the_adviser_undue_pressure_commit || ""
      );
      setQuestion17(selectedSurvey.is_timing_deliver_review_by_adviser || "");
      setQuestion18(selectedSurvey.the_broker_fee_paid_represents || "");
      setQuestion19(
        selectedSurvey.explanation_broker_fees_including_refund_policy || ""
      );
      setQuestion20(
        selectedSurvey.is_receive_the_value_expected_broker_fee || ""
      );
      setQuestion21(
        selectedSurvey.is_any_other_documentation_provided_to_you || ""
      );
      setQuestion22(
        selectedSurvey.is_timing_arrangements_made_conduct_review_with_you || ""
      );
      setQuestion23(
        selectedSurvey.is_frequency_communications_receive_from_firm || ""
      );
      setQuestion24(
        selectedSurvey.is_relevance_communications_sent_to_the_firm || ""
      );
      setQuestion25(
        selectedSurvey.is_raising_any_queries_on_communications || ""
      );
      setQuestion26(
        selectedSurvey.is_overall_standard_communications_received_from_firm ||
          ""
      );
      setQuestion27(
        selectedSurvey.is_timely_manner_of_receiving_letter_confirming_recommendation ||
          ""
      );
      setQuestion28(selectedSurvey.do_we_better_serve_next_time || "");
      setQuestion29(
        selectedSurvey.have_any_further_comments_on_the_service_received || ""
      );
      setQuestion30(selectedSurvey.do_you_like_someone_to_contact_you || "");
      setName(selectedSurvey.name || "");
      setEmail(selectedSurvey.email || "");
      setPhoneNumber(selectedSurvey.phone_number || "");
      setNote(selectedSurvey.note || "");
    } else {
      // No existing survey — initialize as empty
      setClientSurvey(false);
      setAdviserName("");
      setQuestion2("");
      setQuestion3("");
      setQuestion4("");
      setQuestion5("");
      setQuestion6("");
      setQuestion7("");
      setQuestion8("");
      setQuestion9("");
      setQuestion10("");
      setQuestion11("");
      setQuestion12("");
      setQuestion13("");
      setQuestion14("");
      setQuestion15("");
      setQuestion16("");
      setQuestion17("");
      setQuestion18("");
      setQuestion19("");
      setQuestion20("");
      setQuestion21("");
      setQuestion22("");
      setQuestion23("");
      setQuestion24("");
      setQuestion25("");
      setQuestion26("");
      setQuestion27("");
      setQuestion28("");
      setQuestion29("");
      setQuestion30("");
      setName("");
      setEmail("");
      setPhoneNumber("");
      setNote("");
    }
  }, [selectedSurvey]);

  // === STEP 4: Handlers ===
  const handleInputChange =
    (
      field:
        | "adviserName"
        | "question2"
        | "question3"
        | "question4"
        | "question5"
        | "question6"
        | "question7"
        | "question8"
        | "question9"
        | "question10"
        | "question11"
        | "question12"
        | "question13"
        | "question14"
        | "question15"
        | "question16"
        | "question17"
        | "question18"
        | "question19"
        | "question20"
        | "question21"
        | "question22"
        | "question23"
        | "question24"
        | "question25"
        | "question26"
        | "question27"
        | "question28"
        | "question29"
        | "question30"
        | "name"
        | "email"
        | "phoneNumber"
        | "note"
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      switch (field) {
        case "adviserName":
          setAdviserName(value);
          break;
        case "question2":
          setQuestion2(value);
          break;
        case "question3":
          setQuestion3(value);
          break;
        case "question4":
          setQuestion4(value);
          break;
        case "question5":
          setQuestion5(value);
          break;
        case "question6":
          setQuestion6(value);
          break;
        case "question7":
          setQuestion7(value);
          break;
        case "question8":
          setQuestion8(value);
          break;
        case "question9":
          setQuestion9(value);
          break;
        case "question10":
          setQuestion10(value);
          break;
        case "question11":
          setQuestion11(value);
          break;
        case "question12":
          setQuestion12(value);
          break;
        case "question13":
          setQuestion13(value);
          break;
        case "question14":
          setQuestion14(value);
          break;
        case "question15":
          setQuestion15(value);
          break;
        case "question16":
          setQuestion16(value);
          break;
        case "question17":
          setQuestion17(value);
          break;
        case "question18":
          setQuestion18(value);
          break;
        case "question19":
          setQuestion19(value);
          break;
        case "question20":
          setQuestion20(value);
          break;
        case "question21":
          setQuestion21(value);
          break;
        case "question22":
          setQuestion22(value);
          break;
        case "question23":
          setQuestion23(value);
          break;
        case "question24":
          setQuestion24(value);
          break;
        case "question25":
          setQuestion25(value);
          break;
        case "question26":
          setQuestion26(value);
          break;
        case "question27":
          setQuestion27(value);
          break;
        case "question28":
          setQuestion28(value);
          break;
        case "question29":
          setQuestion29(value);
          break;
        case "question30":
          setQuestion30(value);
          break;
        case "name":
          setName(value);
          break;
        case "email":
          setEmail(value);
          break;
        case "phoneNumber":
          setPhoneNumber(value);
          break;
        case "note":
          setNote(value);
        default:
          console.warn(`Unknown field: ${field}`);
          break;
      }
    };

  const handleClientSurveyChange = (value: boolean) => {
    setClientSurvey(value);
    // Auto-update when clicked
    if (surveyAlias) {
      const payload = {
        case_alias: casealias,
        client_survey: value,
      };

      updateClientSurvey({
        case_alias: casealias,
        survey_alias: surveyAlias,
        payload,
      })
        .then((response) => {
          if (response.data) {
            toast.success("Client survey updated successfully!");
          } else if (response.error) {
            // Extract backend error message - prioritize details field
            const errorMessage =
              (response.error as any)?.data?.detail ||
              "Failed to update client survey.";
            toast.error(errorMessage);
            // Revert the state if update fails
            setClientSurvey(!value);
          }
        })
        .catch((error) => {
          // Handle any unexpected errors
          const errorMessage = error?.message || "An unexpected error occurred";
          toast.error(errorMessage);
          // Revert the state if update fails
          setClientSurvey(!value);
        });
    }
  };

  // === STEP 5: Final Submit (Validation) ===
  // In handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!casealias) return toast.error("Case alias missing");

    const payload = {
      case_alias: casealias,
      client_survey: clientSurvey,
      adviser_name: adviserName.trim(),
      is_clarification_explanation_of_the_service_firm: question2,
      is_timely_service_delivery: question3,
      is_helpfulness_representative: question4,
      the_firm_offices_reasonable: question5,
      is_accuracy_information_provided: question6,
      is_clarification_explanation_paid: question7,
      is_raising_queries_relating_service: question8,
      is_clarification_explanation_protection_review: question9,
      is_understanding_of_financial_objectives: question10,
      is_explanation_consideration_of_attitude_risk: question11,
      is_explanation_consideration_capacity_loss_of_capital: question12,
      is_explanation_adviser_product: question13,
      is_interaction_adviser_professionals: question14,
      is_suitable_advice_for_your_needs: question15,
      is_ability_of_the_adviser_undue_pressure_commit: question16,
      is_timing_deliver_review_by_adviser: question17,
      the_broker_fee_paid_represents: question18,
      explanation_broker_fees_including_refund_policy: question19,
      is_receive_the_value_expected_broker_fee: question20,
      is_any_other_documentation_provided_to_you: question21,
      is_timing_arrangements_made_conduct_review_with_you: question22,
      is_frequency_communications_receive_from_firm: question23,
      is_relevance_communications_sent_to_the_firm: question24,
      is_raising_any_queries_on_communications: question25,
      is_overall_standard_communications_received_from_firm: question26,
      is_timely_manner_of_receiving_letter_confirming_recommendation:
        question27,
      do_we_better_serve_next_time: question28,
      have_any_further_comments_on_the_service_received: question29,
      do_you_like_someone_to_contact_you: question30,
      name: name,
      email: email,
      phone_number: phoneNumber,
      note: note,
    };

    try {
      if (surveyAlias) {
        const response = await updateClientSurvey({
          case_alias: casealias,
          survey_alias: surveyAlias,
          payload,
        });

        if (response.data) {
          toast.success("Saved successfully!");
          try {
            await updateSectionCompleteStatus({
              case_alias: casealias,
              section_data: { is_client_survey: true },
            });
          } catch (err) {
            console.error("Failed to update section complete status:", err);
          }
        } else if (response.error) {
          // Extract backend error message - prioritize details field
          const errorMessage =
            (response.error as any)?.data?.detail ||
            "Save failed. Check input or contact support.";
          toast.error(errorMessage);
        } else {
          toast.error("Save failed. Check input or contact support.");
        }
      }
    } catch (error: any) {
      // Handle any unexpected errors
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  };

  // === STEP 6: Navigation ===
  const currentTab: string | null = useAppSelector(
    (state) => state.caseDetails.basicTabId
  );

  const handleNextTab = () => {
    const nextTabNav: string | null = getNextTabNav(
      caseData?.case_stage,
      currentTab!
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  // === STEP 7: Loading & Error States ===
  if (isSurveyLoading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load survey data.");
  }

  return (
    <Card>
      <CardBody>
        {/* Info Banner */}
        <div className="d-flex justify-content-between">
          {session?.user?.user_type !== "CLIENT" && (
            <div>
              <Form>
                <FormGroup>
                  <div className="d-flex align-items-center mb-3">
                    <Label className="me-3 mb-0">Client Survey:</Label>
                    <div className="d-flex gap-2">
                      <Button
                        color={clientSurvey ? "success" : "outline-success"}
                        size="sm"
                        onClick={() => handleClientSurveyChange(true)}
                        disabled={isUpdating}
                      >
                        Yes
                      </Button>
                      <Button
                        color={!clientSurvey ? "danger" : "outline-danger"}
                        size="sm"
                        onClick={() => handleClientSurveyChange(false)}
                        disabled={isUpdating}
                      >
                        No
                      </Button>
                    </div>
                    <Badge
                      color={
                        selectedSurvey?.client_survey ? "success" : "danger"
                      }
                      className="ms-2"
                    >
                      {selectedSurvey?.client_survey
                        ? "Enabled for Client"
                        : "Disabled for Client"}
                    </Badge>
                  </div>
                </FormGroup>
              </Form>
            </div>
          )}
          <div>
            {selectedSurvey === null ? (
              <Alert color="info" className="mb-4">
                No survey data found. A new survey will be created when you
                save.
              </Alert>
            ) : new Date(selectedSurvey?.created_at)
                .toISOString()
                .slice(0, 16) ===
              new Date(selectedSurvey?.updated_at)
                .toISOString()
                .slice(0, 16) ? (
              ""
            ) : (
              session?.user?.user_type !== "CLIENT" && (
                <p className="text-muted small mb-3">
                  Editing survey submitted on{" "}
                  {new Date(selectedSurvey.updated_at).toLocaleDateString()} by{" "}
                  <span className="fw-bold">
                    {selectedSurvey.updated_by?.first_name}{" "}
                    {selectedSurvey.updated_by?.last_name}
                  </span>
                </p>
              )
            )}
          </div>
        </div>
        {session?.user?.user_type !== "CLIENT" ||
        !!selectedSurvey?.client_survey ? (
          <>
            {/* Header */}
            <Row className="mb-3 d-flex justify-content-between gap-3">
              <Col className="border-b-primary border-2">
                <h3 className="text-center">Questions</h3>
              </Col>
              <Col className="border-b-primary border-2">
                <h3 className="text-center">Answers</h3>
              </Col>
            </Row>
            <Form onSubmit={handleSubmit}>
              {/* Question 1: Adviser Name */}
              <Row className="border-top border-primary border-2 p-2">
                <Col md={6}>
                  <Label htmlFor="adviserName">Your Adviser Name*</Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      type="text"
                      id="adviserName"
                      name="adviser_name"
                      placeholder="Enter adviser name"
                      required
                      value={adviserName}
                      onChange={handleInputChange("adviserName")}
                      disabled={isUpdating}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* Question 2 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The clarification and explanation of the service to be
                    provided by the firm.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question2"
                          value={option.value}
                          checked={question2 === option.value}
                          onChange={handleInputChange("question2")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>

              {/* Question 3 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>The timely delivery of the service by the firm.</Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question3"
                          value={option.value}
                          checked={question3 === option.value}
                          onChange={handleInputChange("question3")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 4 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The helpfulness of any representative of the firm who you
                    dealt with.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question4"
                          value={option.value}
                          checked={question4 === option.value}
                          onChange={handleInputChange("question4")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 5 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The way you were dealt with if you had to contact the firm’s
                    offices for any reason.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question5"
                          value={option.value}
                          checked={question5 === option.value}
                          onChange={handleInputChange("question5")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 6 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The accuracy of the information provided to you by the firm.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question6"
                          value={option.value}
                          checked={question6 === option.value}
                          onChange={handleInputChange("question6")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 7 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The clarification and explanation of how the firm were to be
                    paid.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question7"
                          value={option.value}
                          checked={question7 === option.value}
                          onChange={handleInputChange("question7")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 8 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The way you were treated by the firm when raising any
                    queries relating to service.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question8"
                          value={option.value}
                          checked={question8 === option.value}
                          onChange={handleInputChange("question8")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 9 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The clarification and explanation of the firm will provide a
                    protection review or referral to a protection specialist.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question9"
                          value={option.value}
                          checked={question9 === option.value}
                          onChange={handleInputChange("question9")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <p>
                    Please comment on the adviser who dealt with your
                    application *
                  </p>
                </Col>
              </Row>

              {/* Question 10 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The process the adviser went through to gain an
                    understanding of your financial objectives.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question10"
                          value={option.value}
                          checked={question10 === option.value}
                          onChange={handleInputChange("question10")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>

              {/* Question 11 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The establishment, explanation and consideration of your
                    attitude to risk.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question11"
                          value={option.value}
                          checked={question11 === option.value}
                          onChange={handleInputChange("question11")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 12 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The establishment, explanation and consideration of your
                    capacity for loss of capital.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question12"
                          value={option.value}
                          checked={question12 === option.value}
                          onChange={handleInputChange("question12")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 13 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The explanation the adviser gave you on how the
                    product/advice was to work and why it has been recommended
                    to you?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question13"
                          value={option.value}
                          checked={question13 === option.value}
                          onChange={handleInputChange("question13")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 14 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The interaction of your adviser with other professionals
                    (e.g. accountant/solicitor)?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question14"
                          value={option.value}
                          checked={question14 === option.value}
                          onChange={handleInputChange("question14")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 15 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The provision of objective and suitable advice for your
                    needs.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question15"
                          value={option.value}
                          checked={question15 === option.value}
                          onChange={handleInputChange("question15")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 16 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The ability of the adviser to put you at ease and not make
                    you feel you were under any undue pressure to commit.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question16"
                          value={option.value}
                          checked={question16 === option.value}
                          onChange={handleInputChange("question16")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 17 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The timing and delivery of the review by the adviser.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question17"
                          value={option.value}
                          checked={question17 === option.value}
                          onChange={handleInputChange("question17")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>

              {/* Question 18 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    Do you feel the broker fee paid represents fair value for
                    the service you received?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question18"
                          value={option.value}
                          checked={question18 === option.value}
                          onChange={handleInputChange("question18")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 19 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    Was the explanation of broker fees including refund policy?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question19"
                          value={option.value}
                          checked={question19 === option.value}
                          onChange={handleInputChange("question19")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 20 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    Did you receive the value you expected from the broker fee
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question20"
                          value={option.value}
                          checked={question20 === option.value}
                          onChange={handleInputChange("question20")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <p>Communications & Understanding *</p>
                </Col>
              </Row>
              {/* Question 21 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The clarity of any letters, emails, brochures and any other
                    documentation provided to you.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question21"
                          value={option.value}
                          checked={question21 === option.value}
                          onChange={handleInputChange("question21")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 22 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The timing and arrangements made to conduct a review with
                    you.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question22"
                          value={option.value}
                          checked={question22 === option.value}
                          onChange={handleInputChange("question22")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 23 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The frequency of communications you receive from the firm.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question23"
                          value={option.value}
                          checked={question23 === option.value}
                          onChange={handleInputChange("question23")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 24 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The relevance of any communications sent to you by the firm.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question24"
                          value={option.value}
                          checked={question24 === option.value}
                          onChange={handleInputChange("question24")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 25 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The way you were treated by the firm when raising any
                    queries on communications.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question25"
                          value={option.value}
                          checked={question25 === option.value}
                          onChange={handleInputChange("question25")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 26 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The overall standard of communications received from the
                    firm.
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question26"
                          value={option.value}
                          checked={question26 === option.value}
                          onChange={handleInputChange("question26")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 27 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    The timely manner of receiving your letter confirming the
                    recommendation and that it explained everything clearly?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    {ANSWER_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className="d-flex align-items-center mb-1"
                      >
                        <Input
                          type="radio"
                          name="question27"
                          value={option.value}
                          checked={question27 === option.value}
                          onChange={handleInputChange("question27")}
                          disabled={isUpdating}
                        />
                        <span className="ms-1">{option.label}</span>
                      </div>
                    ))}
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 28 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label htmlFor="do_we_better_serve_next_time">
                    What could we do to better serve your needs next time?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      type="text"
                      id="do_we_better_serve_next_time"
                      name="do_we_better_serve_next_time"
                      value={question28}
                      onChange={handleInputChange("question28")}
                      disabled={isUpdating}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 28 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label htmlFor="have_any_further_comments_on_the_service_received">
                    Do you have any further comments on the service received?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Input
                      type="text"
                      id="have_any_further_comments_on_the_service_received"
                      name="have_any_further_comments_on_the_service_received"
                      value={question29}
                      onChange={handleInputChange("question29")}
                      disabled={isUpdating}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {/* Question 30 */}
              <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
                <Col md={6}>
                  <Label>
                    How satisfied are you with the service received?
                  </Label>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <div className="d-flex flex-wrap justify-content-center align-items-center">
                      {["Yes", "No"].map((option) => (
                        <div
                          key={option}
                          className="d-flex align-items-center me-3"
                        >
                          <Input
                            type="radio"
                            name="question30"
                            value={option.toUpperCase()}
                            checked={question30 === option.toUpperCase()}
                            onChange={handleInputChange("question30")}
                            disabled={isUpdating}
                          />
                          <span className="ms-1">{option}</span>
                        </div>
                      ))}
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={handleInputChange("name")}
                      disabled={isUpdating}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email Address (optional)</Label>
                    <Input
                      type="text"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange("email")}
                      disabled={isUpdating}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone_number">Phone Number (optional)</Label>
                    <Input
                      type="text"
                      id="phone_number"
                      name="phone_number"
                      value={phoneNumber}
                      onChange={handleInputChange("phoneNumber")}
                      disabled={isUpdating}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="note">Additional Note (optional)</Label>
                    <Input
                      type="textarea"
                      id="note"
                      name="note"
                      value={note}
                      onChange={handleInputChange("note")}
                      disabled={isUpdating}
                    />
                  </FormGroup>
                </Col>
              </Row>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end mt-4 gap-2">
                <Button color="primary" type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  color="secondary"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (
                      session?.user?.user_type === "CLIENT" &&
                      selectedSurvey?.updated_by !== null
                    ) {
                      handleNextTab();
                    } else {
                      await handleSubmit(e);
                      handleNextTab();
                    }
                  }}
                  disabled={isUpdating}
                >
                  {session?.user?.user_type === "CLIENT"
                    ? "Go To Next"
                    : "Save & Next"}
                </Button>
              </div>
            </Form>
          </>
        ) : (
          <p className="fs-3 text-muted text-center text-warning mb-3">
            Client survey is not enabled. Please! contact your adviser to enable
            it.
          </p>
        )}
      </CardBody>
    </Card>
  );
};

export default ClientSurveyContent;
