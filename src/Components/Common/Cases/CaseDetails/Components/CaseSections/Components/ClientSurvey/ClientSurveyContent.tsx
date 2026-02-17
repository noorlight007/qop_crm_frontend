import LoadingSpinner from "@/app/loading";
import { ANSWER_OPTIONS } from "@/Data/Common/ClientSurvey";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useGetClientSurveyQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ClientSurvey/ClientSurveyApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  Alert,
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

const ClientSurveyContent: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();

  // RTK Queries
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const {
    data: clientSurveyList, // Now an array
    isLoading: isSurveyLoading,
    isError,
  } = useGetClientSurveyQuery({ case_alias: casealias }, { skip: !casealias });

  // Local form state
  const [adviserName, setAdviserName] = React.useState<string>("");
  const [question1, setQuestion1] = React.useState<string>("");
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

  // === STEP 1: Extract the Most Relevant Survey Record ===
  const selectedSurvey = useMemo(() => {
    if (!clientSurveyList) return null;

    // If API returned an array, pick the newest by created_at
    if (Array.isArray(clientSurveyList)) {
      if (clientSurveyList.length === 0) return null;
      const sorted = [...clientSurveyList].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      return sorted[0];
    }

    // If API returned a single object (not an array), use it directly
    if (typeof clientSurveyList === "object") return clientSurveyList as any;

    return null;
  }, [clientSurveyList]);

  // === STEP 3: Sync form state when selectedSurvey changes ===
  useEffect(() => {
    if (selectedSurvey && typeof selectedSurvey === "object") {
      setAdviserName(selectedSurvey.adviser_name || "");
      setQuestion1(selectedSurvey.felt_valued_by_adviser || "");
      setQuestion2(selectedSurvey.felt_valued_by_firm || "");
      setQuestion3(selectedSurvey.adviser_communication_clear || "");
      setQuestion4(selectedSurvey.firm_communication_clear || "");
      setQuestion5(selectedSurvey.adviser_treated_client_fairly || "");
      setQuestion6(selectedSurvey.firm_treated_client_fairly || "");
      setQuestion7(selectedSurvey.firm_fees_information_clear || "");
      setQuestion8(selectedSurvey.received_disclosure_document || "");
      setQuestion9(selectedSurvey.adviser_explained_interest_rate_risks || "");
      setQuestion10(selectedSurvey.mortgage_tailored_to_client || "");
      setQuestion11(
        selectedSurvey.received_mortgage_recommendation_letter || "",
      );
      setQuestion12(selectedSurvey.offered_mortgage_and_home_protection || "");
      setQuestion13(selectedSurvey.satisfied_with_advice_process || "");
      setQuestion14(selectedSurvey.overall_service_satisfaction || "");
      setQuestion15(selectedSurvey.would_recommend_adviser || "");
      setQuestion16(selectedSurvey.would_recommend_firm || "");
      setQuestion17(selectedSurvey.service_improvement_suggestions || "");
      setQuestion18(selectedSurvey.service_strengths_feedback || "");
    } else {
      // No existing survey — initialize as empty
      setAdviserName("");
      setQuestion1("");
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
    }
  }, [selectedSurvey]);

  // === STEP 4: Handlers ===
  const handleInputChange =
    (
      field:
        | "adviserName"
        | "question1"
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
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      switch (field) {
        case "adviserName":
          setAdviserName(value);
          break;
        case "question1":
          setQuestion1(value);
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
        default:
          console.warn(`Unknown field: ${field}`);
          break;
      }
    };

  // Render radio answers as pill-style selectable options (CSS-only)
  const renderPillOptions = (
    fieldName: string,
    selectedValue: string | undefined,
    changeHandler: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void,
  ) => (
    <FormGroup className="mb-0">
      {ANSWER_OPTIONS.map((option) => {
        const active = selectedValue === option.value;
        const labelClass = `me-2 d-inline-flex align-items-center mb-2 rounded-pill px-3 py-1 border border-secondary ${
          active ? "bg-primary text-white border-primary" : "bg-white text-dark"
        }`;

        return (
          <label
            key={option.value}
            className={labelClass}
            style={{ cursor: "pointer" }}
          >
            <Input
              type="radio"
              name={fieldName}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={changeHandler as any}
              className="visually-hidden"
            />
            <span className="ms-2" style={{ fontSize: 14 }}>
              {option.label}
            </span>
          </label>
        );
      })}
    </FormGroup>
  );

  // === STEP 6: Navigation ===
  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const handleNextTab = () => {
    const nextTabNav: string | null = getNextTabNav(
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
                  Survey submitted on{" "}
                  {formatDateAndTime(selectedSurvey?.updated_at)}
                </p>
              )
            )}
          </div>
        </div>

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
          <Form onSubmit={(e) => e.preventDefault()}>
            {/* Adviser Name */}
            <Row className="border-top border-primary border-2 p-2">
              <Col md={6}>
                <Label htmlFor="adviserName">
                  Your Adviser Name<span className="text-danger">*</span>
                </Label>
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
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Question 1 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  1. Throughout the process, I was made to feel valued by my
                  adviser.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question1",
                  question1,
                  handleInputChange("question1"),
                )}
              </Col>
            </Row>

            {/* Question 2 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  2. Throughout the process, I was made to feel valued by the firm.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question2",
                  question2,
                  handleInputChange("question2"),
                )}
              </Col>
            </Row>
            {/* Question 3 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  3. My adviser communicated with me in a way that felt clear and
                  easy to understand.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question3",
                  question3,
                  handleInputChange("question3"),
                )}
              </Col>
            </Row>
            {/* Question 4 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  4. The firm communicated with me in a way that felt clear and
                  easy to understand.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question4",
                  question4,
                  handleInputChange("question4"),
                )}
              </Col>
            </Row>
            {/* Question 5 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>5. I feel that my advisor treated me fairly.</Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question5",
                  question5,
                  handleInputChange("question5"),
                )}
              </Col>
            </Row>
            {/* Question 6 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>6. I feel that the firm treated me fairly.</Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question6",
                  question6,
                  handleInputChange("question6"),
                )}
              </Col>
            </Row>
            {/* Question 7 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  7. The information about the firm's fees and charges was made
                  clear to me from the outset.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question7",
                  question7,
                  handleInputChange("question7"),
                )}
              </Col>
            </Row>
            {/* Question 8 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  8. I received a disclosure document confirming these details.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question8",
                  question8,
                  handleInputChange("question8"),
                )}
              </Col>
            </Row>
            {/* Question 9 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  9. My advisor clearly explained the potential risks and impacts
                  of interest rate changes once my deal expires.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question9",
                  question9,
                  handleInputChange("question9"),
                )}
              </Col>
            </Row>

            {/* Question 10 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  10. I am confident that the mortgage was tailored to my personal
                  circumstances and understand why this specific mortgage was
                  recommended to me.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question10",
                  question10,
                  handleInputChange("question10"),
                )}
              </Col>
            </Row>
            {/* Question 11 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  11. I received a letter of recommendation detailing how the
                  mortgage was right based on my circumstances, within a week of
                  the application being submitted.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question11",
                  question11,
                  handleInputChange("question11"),
                )}
              </Col>
            </Row>
            {/* Question 12 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  12. I was provided the opportunity to protect my mortgage my
                  mortgage and home.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question12",
                  question12,
                  handleInputChange("question12"),
                )}
              </Col>
            </Row>
            {/* Question 13 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>13. Overall I am satisfied with the advice process.</Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question13",
                  question13,
                  handleInputChange("question13"),
                )}
              </Col>
            </Row>
            {/* Question 14 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>14. Overall I am satisfied with the service provided.</Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question14",
                  question14,
                  handleInputChange("question14"),
                )}
              </Col>
            </Row>
            {/* Question 15 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  15. Based on my experience I would recommend the adviser to my
                  friends and family.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question15",
                  question15,
                  handleInputChange("question15"),
                )}
              </Col>
            </Row>
            {/* Question 16 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  16. Based on my experience I would recommend the firm to my
                  friends and family.
                </Label>
              </Col>
              <Col md={6}>
                {renderPillOptions(
                  "question16",
                  question16,
                  handleInputChange("question16"),
                )}
              </Col>
            </Row>

            {/* Question 17 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  17. Do you feel the broker fee paid represents fair value for the
                  service you received?
                </Label>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Input
                    type="textarea"
                    name="question17"
                    id="question17"
                    placeholder="Please describe any suggestions for improving the service"
                    value={question17}
                    onChange={handleInputChange("question17")}
                    rows={4}
                  />
                </FormGroup>
              </Col>
            </Row>
            {/* Question 18 */}
            <Row className="border-2 border-l-primary border-r-primary border-b-primary p-2">
              <Col md={6}>
                <Label>
                  18. Was the explanation of broker fees including refund policy?
                </Label>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Input
                    type="textarea"
                    name="question18"
                    id="question18"
                    placeholder="Please provide any feedback on strengths of the service"
                    value={question18}
                    onChange={handleInputChange("question18")}
                    rows={4}
                  />
                </FormGroup>
              </Col>
            </Row>
            {/* Action Buttons */}
            <div className="d-flex justify-content-end mt-4 gap-2">
              <Button
                color="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  handleNextTab();
                }}
                type="button"
              >
                Go To Next
              </Button>
            </div>
          </Form>
        </>
      </CardBody>
    </Card>
  );
};

export default ClientSurveyContent;
