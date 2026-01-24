import { FC } from "react";
import { Button, Col, FormGroup, Input, Row } from "reactstrap";

interface DisclosureItemProps {
  name: string;
  textName: string;
  reference: string;
  title: string;
  answer: string | null;
  comment: string | null;
  index: number;
  onAnswerChange: (name: string, value: string) => void;
  onCommentChange: (name: string, value: string) => void;
}

export const DisclosureItem: FC<DisclosureItemProps> = ({
  name,
  textName,
  reference,
  title,
  answer,
  comment,
  index,
  onAnswerChange,
  onCommentChange,
}) => {
  return (
    <Row
      className={`border p-4 rounded-3 bg-white shadow-sm ${
        index > 0 ? "mt-3" : ""
      }`}
    >
      <Col xs={12} md={6} className="mb-3 mb-md-0">
        <div className="d-flex gap-3">
          <span className="badge bg-primary px-3 py-2 rounded-2 align-self-start">
            {reference}
          </span>
          <h6 className="fw-bold mb-0 lh-base">{title}</h6>
        </div>
      </Col>

      <Col xs={12} md={3} className="mb-3 mb-md-0">
        <div className="d-flex gap-2 justify-content-md-center">
          <FormGroup check className="rounded-2">
            <Input
              type="select"
              name={`answer-${name}`}
              id={`answer-${name}`}
              className="me-2 border-success"
              value={answer || ""}
              onChange={(e) => onAnswerChange(name, e.target.value)}
            >
              <option value="YES">Yes</option>
              <option value="NO">No</option>
              <option value="N/A">Not Applicable</option>
            </Input>
          </FormGroup>
        </div>
      </Col>

      <Col
        xs={12}
        md={3}
        className="d-flex align-items-center justify-content-md-end"
      >
        <Button
          color="primary"
          id={`documentsButton-${name}`}
          className="px-3 py-2 rounded-2 w-100 w-md-auto"
          outline
        >
          <i className="fas fa-file-alt me-2"></i>
          Associated Documents
        </Button>
      </Col>

      <Col xs={12} className="mt-3">
        <Input
          type="textarea"
          name={`comment-${textName}`}
          id={`comment-${textName}`}
          placeholder="Add your comments here..."
          className="form-control border"
          value={comment || ""}
          onChange={(e) => onCommentChange(textName, e.target.value)}
          style={{
            minHeight: "80px",
            resize: "none",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        />
      </Col>
    </Row>
  );
};
