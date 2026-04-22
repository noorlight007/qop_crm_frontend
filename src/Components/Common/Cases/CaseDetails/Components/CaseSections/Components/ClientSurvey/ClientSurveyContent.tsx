import { LoadingSpinner2 } from "@/app/loading";
import {
  ANSWER_OPTIONS,
  ClientSurveyQuestions,
} from "@/Data/Common/ClientSurvey";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import {
  useDownloadClientSurveyMutation,
  useGetClientSurveyQuery,
} from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ClientSurvey/ClientSurveyApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import { formatDateAndTime } from "@/utils/dateAndTimeFormatter";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Send } from "react-feather";
import { FaDownload } from "react-icons/fa";
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
  Spinner,
} from "reactstrap";
import SendSurveyToClientModal from "./Modals/SendSurveyToClientModal";

const ClientSurveyContent: React.FC = () => {
  const { data: session } = useSession();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();

  const resolvedCaseAlias =
    typeof casealias === "string"
      ? casealias
      : Array.isArray(casealias)
        ? casealias[0]
        : undefined;

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const toggleConfirmModal = () => setIsConfirmModalOpen((prev) => !prev);

  // RTK Queries
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: resolvedCaseAlias },
    { skip: !resolvedCaseAlias },
  );

  const [clientSurveyBlob, { isLoading: isDownloadingSurvey }] =
    useDownloadClientSurveyMutation();

  const downloadSurvey = async () => {
    try {
      const blob = await clientSurveyBlob({
        case_alias: resolvedCaseAlias,
      }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `client-survey(${caseData?.name}).pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download report. Please try again.");
    }
  };

  const {
    data: clientSurveyList,
    isLoading: isSurveyLoading,
    isError,
  } = useGetClientSurveyQuery(
    { case_alias: resolvedCaseAlias },
    { skip: !resolvedCaseAlias },
  );

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

  const selectedSurvey = useMemo(() => {
    if (!clientSurveyList) return null;
    if (Array.isArray(clientSurveyList)) {
      if (clientSurveyList.length === 0) return null;
      const sorted = [...clientSurveyList].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      return sorted[0];
    }
    if (typeof clientSurveyList === "object") return clientSurveyList as any;
    return null;
  }, [clientSurveyList]);

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
      const nextState = { ...initialFormState } as {
        -readonly [K in keyof FormState]: string;
      };
      (Object.keys(surveyFieldMap) as Array<keyof FormState>).forEach(
        (formKey) => {
          const surveyKey = surveyFieldMap[formKey];
          nextState[formKey] = selectedSurvey[surveyKey] ?? "";
        },
      );
      setFormState(nextState);
    } else {
      setFormState({ ...initialFormState });
    }
  }, [selectedSurvey]);

  const handleInputChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormState((s) => ({ ...s, [field]: value }));
    };

  const renderPillOptions = (
    fieldName: string,
    selectedValue: string | undefined,
    changeHandler: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void,
    disabled = false,
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
            style={{
              cursor: disabled ? "not-allowed" : "pointer", // 👈 use disabled
              opacity: disabled && !active ? 0.5 : 1, // 👈 use disabled
            }}
          >
            <Input
              type="radio"
              name={fieldName}
              value={option.value}
              checked={active}
              onChange={changeHandler as any}
              className="visually-hidden"
              disabled={disabled} // 👈 use disabled
            />
            <span className="ms-2" style={{ fontSize: 14 }}>
              {option.label}
            </span>
          </label>
        );
      })}
    </FormGroup>
  );

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

  if (isSurveyLoading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <LoadingSpinner2 />
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load survey data.");
  }

  return (
    <Card>
      <CardBody>
        <SendSurveyToClientModal
          isOpen={isConfirmModalOpen}
          toggle={toggleConfirmModal}
          caseAlias={resolvedCaseAlias}
          onSuccess={() => setIsConfirmModalOpen(false)}
          surveySentCount={selectedSurvey?.survey_sent_count ?? 0}
        />

        {/* Info Banner */}
        <div className="d-flex justify-content-between">
          <div className="d-flex gap-2 mb-4">
            {session?.user?.role === "APPLICANT" ? null : (
              <Button
                color="primary"
                outline
                onClick={toggleConfirmModal}
                disabled={!resolvedCaseAlias}
              >
                <Send size={15} className="me-1" /> Send Survey Form To the
                Client
              </Button>
            )}

            <Button
              color="secondary"
              onClick={downloadSurvey}
              disabled={isDownloadingSurvey}
            >
              {isDownloadingSurvey ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <FaDownload className="me-2" />
                  Download Survey
                </>
              )}
            </Button>
          </div>
          <div>
            {selectedSurvey === null ? (
              <Alert color="info" className="mb-4">
                No survey data found. A new survey will be created when you
                save.
              </Alert>
            ) : formatDateAndTime(selectedSurvey?.created_at) ===
              formatDateAndTime(selectedSurvey?.updated_at) ? (
              ""
            ) : (
              session?.user?.role !== "APPLICANT" && (
                <p className="small mb-3">
                  Survey submitted on{" "}
                  {formatDateAndTime(selectedSurvey?.updated_at)}
                </p>
              )
            )}
          </div>
        </div>

        <>
          <Row className="mb-3 d-flex justify-content-between gap-3">
            <Col className="border-b-primary border-2">
              <h3 className="text-center">Questions</h3>
            </Col>
            <Col className="border-b-primary border-2">
              <h3 className="text-center">Answers</h3>
            </Col>
          </Row>
          <Form onSubmit={(e) => e.preventDefault()}>
            {ClientSurveyQuestions.map((q, idx) => (
              <Row
                key={String(q.id)}
                className={`border-2 border-l-primary border-r-primary border-b-primary p-2${idx === 0 ? " border-t-primary" : ""}`}
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
                      true,
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
                        readOnly
                        disabled
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
                        readOnly
                        disabled
                      />
                    </FormGroup>
                  )}
                </Col>
              </Row>
            ))}
            <div className="d-flex justify-content-end mt-4 gap-2">
              {session?.user?.role !== "APPLICANT" && (
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
              )}
            </div>
          </Form>
        </>
      </CardBody>
    </Card>
  );
};

export default ClientSurveyContent;
