import {
  ANSWER_OPTIONS,
  ClientSurveyQuestions,
} from "@/Data/Common/ClientSurvey";
import React from "react";
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

  const handleInputChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((s) => ({ ...s, [field]: e.target.value }));
    };

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
            <span className="ms-2">{option.label}</span>
          </label>
        );
      })}
    </FormGroup>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // for now just log — integrate save/submit API where needed
    console.log("Survey submit:", formState);
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
                  </FormGroup>
                )}
              </Col>
            </Row>
          ))}

          <div className="d-flex justify-content-end mt-4">
            <Button color="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SurveyForm;
