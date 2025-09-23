import { FC } from "react";
import { Input, Card, Row, Col } from "reactstrap";

const DocumentManagementFilterBar: FC = () => {
  return (
    <Card className="p-3 my-3 shadow-sm">
      <Row>
        <Col>
          <Input
            type="text"
            placeholder="Search documents..."
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
            <option>All Categories</option>
            <option>Category 1</option>
            <option>Category 2</option>
            <option>Category 3</option>
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
        <Col>
          <Input
            type="select"
            className="form-control"
            style={{ height: "45px" }}
          >
            <option>All Clients</option>
            <option>Client 1</option>
            <option>Client 2</option>
            <option>Client 3</option>
          </Input>
        </Col>
      </Row>
    </Card>
  );
};

export default DocumentManagementFilterBar;
