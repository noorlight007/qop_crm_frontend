import {
  ANSWER_OPTIONS,
  ClientSurveyQuestions,
} from "@/Data/Common/ClientSurvey";
import { usePostClientSurveyMutation } from "@/Redux/Reducers/Common/ClientSurvey/ClientSurveyApi";
import { useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import {
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

const SurveyForm: React.FC = () => {
  const [clientSurvey, { isLoading }] = usePostClientSurveyMutation();
  const searchParams = useSearchParams();

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

  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );

  const apiToFormKeyMap: Record<string, keyof FormState> = {
    adviser_name: "adviserName",
    felt_valued_by_adviser: "question1",
    felt_valued_by_firm: "question2",
    adviser_communication_clear: "question3",
    firm_communication_clear: "question4",
    adviser_treated_client_fairly: "question5",
    firm_treated_client_fairly: "question6",
    firm_fees_information_clear: "question7",
    received_disclosure_document: "question8",
    adviser_explained_interest_rate_risks: "question9",
    mortgage_tailored_to_client: "question10",
    received_mortgage_recommendation_letter: "question11",
    offered_mortgage_and_home_protection: "question12",
    satisfied_with_advice_process: "question13",
    overall_service_satisfaction: "question14",
    would_recommend_adviser: "question15",
    would_recommend_firm: "question16",
    service_improvement_suggestions: "question17",
    service_strengths_feedback: "question18",
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!err) return out;

    const sanitize = (v: any) => {
      if (v == null) return "";
      if (Array.isArray(v)) return v.map(String).join(", ");
      if (typeof v === "object")
        return Object.values(v)
          .flatMap((x: any) => (Array.isArray(x) ? x : [x]))
          .map(String)
          .join(", ");
      return String(v);
    };

    const source = err?.data ?? err?.error?.data ?? err;
    if (typeof source === "string") {
      out["non_field_errors"] = sanitize(source);
      return out;
    }

    if (source && typeof source === "object") {
      for (const [k, v] of Object.entries(source)) {
        if (k === "detail" || k === "message" || k === "non_field_errors") {
          out["non_field_errors"] = sanitize(v);
          continue;
        }
        const mapped = (apiToFormKeyMap[k] as string) ?? k;
        out[mapped] = sanitize(v);
      }
      return out;
    }

    out["non_field_errors"] = sanitize(source);
    return out;
  };

  const handleInputChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // clear field-level error for this field when user edits
      setFieldErrors((prev) => ({ ...prev, [String(field)]: "" }));
      setFormState((s) => ({ ...s, [field]: e.target.value }));
    };

  const renderPillOptions = (
    fieldName: string,
    selectedValue: string | undefined,
    changeHandler: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void,
    errorMessage?: string,
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
            <span className="ms-2">{option.label}</span>
          </label>
        );
      })}
      {errorMessage && (
        <div className="text-danger small mt-1">{errorMessage}</div>
      )}
    </FormGroup>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const caseId = searchParams?.get("id");
    if (!caseId) {
      toast.error("Case ID is missing. Cannot submit survey.");
      return;
    }

    // basic validation
    if (!formState.adviserName || String(formState.adviserName).trim() === "") {
      setFieldErrors({ adviserName: "Please enter the adviser name." });
      return;
    }

    const payload = {
      adviser_name: formState.adviserName,
      felt_valued_by_adviser: formState.question1,
      felt_valued_by_firm: formState.question2,
      adviser_communication_clear: formState.question3,
      firm_communication_clear: formState.question4,
      adviser_treated_client_fairly: formState.question5,
      firm_treated_client_fairly: formState.question6,
      firm_fees_information_clear: formState.question7,
      received_disclosure_document: formState.question8,
      adviser_explained_interest_rate_risks: formState.question9,
      mortgage_tailored_to_client: formState.question10,
      received_mortgage_recommendation_letter: formState.question11,
      offered_mortgage_and_home_protection: formState.question12,
      satisfied_with_advice_process: formState.question13,
      overall_service_satisfaction: formState.question14,
      would_recommend_adviser: formState.question15,
      would_recommend_firm: formState.question16,
      service_improvement_suggestions: formState.question17,
      service_strengths_feedback: formState.question18,
    } as const;

    try {
      await clientSurvey({ case_id: caseId, payload }).unwrap();
      toast.success("Survey submitted — thank you.");
      setFormState({ ...initialFormState });
      setFieldErrors({});
    } catch (err) {
      // Print API response for debugging
      console.error("Client survey submit error:", err);

      const parsed = parseApiErrors(err as any);
      const fieldKeys = Object.keys(parsed).filter(
        (k) => k !== "non_field_errors",
      );

      if (fieldKeys.length) {
        // show field-level errors under inputs
        setFieldErrors(parsed);
        return; // don't show toast when field errors are present
      }

      const nonField =
        parsed["non_field_errors"] ||
        (err as any)?.message ||
        "Failed to submit survey. Please try again later.";
      toast.error(nonField);
    }
  };

  return (
    <Card className="shadow bg-light-primary">
      <CardBody>
        <Row className="mb-3">
          <Col>
            <h3 className="mb-1">Survey Questions</h3>
            <p className="text-muted mb-0">
              Select one option for each statement.
            </p>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          {ClientSurveyQuestions.map((q, idx) => (
            <Row
              key={q.id}
              className={`border-2 border-l-primary border-r-primary border-b-primary p-3${idx === 0 ? " border-t-primary" : ""}`}
            >
              <Col md={6} className="d-flex align-items-center">
                <Label htmlFor={q.id} className="mb-0">
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
                    fieldErrors[String(q.id)],
                  )
                ) : q.type === "textarea" ? (
                  <FormGroup>
                    <Input
                      type="textarea"
                      id={q.id}
                      name={q.id}
                      placeholder={q.placeholder || ""}
                      value={formState[q.id as keyof FormState]}
                      onChange={handleInputChange(q.id as keyof FormState)}
                      rows={4}
                    />
                    {fieldErrors[String(q.id)] && (
                      <div className="text-danger small mt-1">
                        {fieldErrors[String(q.id)]}
                      </div>
                    )}
                  </FormGroup>
                ) : (
                  <FormGroup>
                    <Input
                      type="text"
                      id={q.id}
                      name={q.id}
                      placeholder={q.placeholder || ""}
                      required={q.required}
                      value={formState[q.id as keyof FormState]}
                      onChange={handleInputChange(q.id as keyof FormState)}
                    />
                    {fieldErrors[String(q.id)] && (
                      <div className="text-danger small mt-1">
                        {fieldErrors[String(q.id)]}
                      </div>
                    )}
                  </FormGroup>
                )}
              </Col>
            </Row>
          ))}

          <div className="d-flex justify-content-end mt-4">
            <Button color="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SurveyForm;
