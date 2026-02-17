import LoadingSpinner from "@/app/loading";
import {
  ANSWER_OPTIONS,
  ClientSurveyQuestions,
} from "@/Data/Common/ClientSurvey";
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

  // Local form state (single mapped object)
  const initialFormState = {
    adviserName: "",
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
    question6: "",
    question7: "",
    question8: "",
    question9: "",
    question10: "",
    question11: "",
    question12: "",
    question13: "",
    question14: "",
    question15: "",
    question16: "",
    question17: "",
    question18: "",
  } as const;

  type FormState = { [K in keyof typeof initialFormState]: string };

  const [formState, setFormState] = React.useState<FormState>({
    ...initialFormState,
  });

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
  const surveyFieldMap: Record<keyof FormState, string> = {
    adviserName: "adviser_name",
    question1: "felt_valued_by_adviser",
    question2: "felt_valued_by_firm",
    question3: "adviser_communication_clear",
    question4: "firm_communication_clear",
    question5: "adviser_treated_client_fairly",
    question6: "firm_treated_client_fairly",
    question7: "firm_fees_information_clear",
    question8: "received_disclosure_document",
    question9: "adviser_explained_interest_rate_risks",
    question10: "mortgage_tailored_to_client",
    question11: "received_mortgage_recommendation_letter",
    question12: "offered_mortgage_and_home_protection",
    question13: "satisfied_with_advice_process",
    question14: "overall_service_satisfaction",
    question15: "would_recommend_adviser",
    question16: "would_recommend_firm",
    question17: "service_improvement_suggestions",
    question18: "service_strengths_feedback",
  };

  useEffect(() => {
    if (selectedSurvey && typeof selectedSurvey === "object") {
      const nextState: FormState = { ...initialFormState };
      (Object.keys(surveyFieldMap) as Array<keyof FormState>).forEach(
        (formKey) => {
          const surveyKey = surveyFieldMap[formKey];
          // @ts-ignore - selectedSurvey comes from API
          nextState[formKey] = selectedSurvey[surveyKey] ?? "";
        },
      );
      setFormState(nextState);
    } else {
      setFormState({ ...initialFormState });
    }
  }, [selectedSurvey]);

  // === STEP 4: Handlers ===
  const handleInputChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormState((s) => ({ ...s, [field]: value }));
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
            {ClientSurveyQuestions.map((q) => (
              <Row
                key={String(q.id)}
                className="border-2 border-l-primary border-r-primary border-b-primary p-2"
              >
                <Col md={6}>
                  <Label htmlFor={String(q.id)}>
                    {q.label}
                    {q.required && <span className="text-danger">*</span>}
                  </Label>
                </Col>
                <Col md={6}>
                  {q.type === "radio" ? (
                    renderPillOptions(
                      String(q.id),
                      formState[q.id as keyof FormState],
                      handleInputChange(q.id as keyof FormState),
                    )
                  ) : q.type === "textarea" ? (
                    <FormGroup>
                      <Input
                        type="textarea"
                        id={String(q.id)}
                        name={String(q.id)}
                        placeholder={q.placeholder || ""}
                        value={formState[q.id as keyof FormState]}
                        onChange={handleInputChange(q.id as keyof FormState)}
                        rows={4}
                      />
                    </FormGroup>
                  ) : (
                    <FormGroup>
                      <Input
                        type="text"
                        id={String(q.id)}
                        name={String(q.id)}
                        placeholder={q.placeholder || ""}
                        required={q.required}
                        value={formState[q.id as keyof FormState]}
                        onChange={handleInputChange(q.id as keyof FormState)}
                      />
                    </FormGroup>
                  )}
                </Col>
              </Row>
            ))}
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
