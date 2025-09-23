import { FC } from "react";
import { Input, Card, Row, Col } from "reactstrap";

const TaskAndReminderFilterBar: FC = () => {
  return (
    <Card className="p-3 my-3 shadow-sm">
      <Row>
        <Col>
          <Input
            type="text"
            placeholder="Search reminders..."
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
            <option>All Assignees</option>
            <option>Assignee 1</option>
            <option>Assignee 2</option>
            <option>Assignee 3</option>
          </Input>
        </Col>
        <Col>
          <Input
            type="select"
            className="form-control"
            style={{ height: "45px" }}
          >
            <option>All Priorities</option>
            <option>Priority 1</option>
            <option>Priority 2</option>
            <option>Priority 3</option>
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
            <option>All Types</option>
            <option>Type 1</option>
            <option>Type 2</option>
            <option>Type 3</option>
          </Input>
        </Col>
      </Row>
    </Card>
  );
};

export default TaskAndReminderFilterBar;
