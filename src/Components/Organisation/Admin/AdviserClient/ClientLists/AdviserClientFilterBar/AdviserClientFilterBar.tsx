import { FC } from "react";
import { Input, Card, Row, Col } from "reactstrap";

const AdviserClientFilterBar: FC = () => {
  return (
    <Card className="p-3 my-3 shadow-sm">
      <Row>
        <Col>
          <Input
            type="text"
            placeholder="Search clients, advisers, emails..."
            className="form-control"
            style={{ height: "45px" }}
          />
        </Col>
        <Col>
          <Input
            type="select"
            className="form-control"
            style={{ height: "45px" }}
          >
            <option>All Advisers</option>
            <option>Adviser 1</option>
            <option>Adviser 2</option>
            <option>Adviser 3</option>
          </Input>
        </Col>
        <Col>
          <Input
            type="select"
            className="form-control"
            style={{ height: "45px" }}
          >
            <option>All Stages</option>
            <option>Stage 1</option>
            <option>Stage 2</option>
            <option>Stage 3</option>
          </Input>
        </Col>
        <Col>
          <Input
            type="select"
            className="form-control"
            style={{ height: "45px" }}
          >
            <option>All Statuses</option>
            <option>Status 1</option>
            <option>Status 2</option>
            <option>Status 3</option>
          </Input>
        </Col>
      </Row>
    </Card>
  );
};

export default AdviserClientFilterBar;
