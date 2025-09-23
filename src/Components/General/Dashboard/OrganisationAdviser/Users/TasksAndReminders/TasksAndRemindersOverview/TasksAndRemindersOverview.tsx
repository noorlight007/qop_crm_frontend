import { TrendingUp } from "react-feather";
import { FaExclamationTriangle } from "react-icons/fa";
import { TbCalendar, TbCircleCheck, TbClock } from "react-icons/tb";
import { Card, CardBody, Col, Row } from "reactstrap";

const TasksAndRemindersOverview: React.FC = () => {
  return (
    <Row>
      <Col md="2">
        <Card className="shadow">
          <CardBody className="d-flex justify-content-between">
            <div>
              <h6>Total Tasks</h6>
              <h2>6</h2>
            </div>
            <div>
              <span
                className="d-flex justify-content-center bg-light-primary rounded-3"
                style={{ height: "30px", width: "30px" }}
              >
                <TbCircleCheck size={16} />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md="2">
        <Card className="shadow">
          <CardBody className="d-flex justify-content-between">
            <div>
              <h6>Completed</h6>
              <h2>1</h2>
            </div>
            <div>
              <span
                className="d-flex justify-content-center bg-light-success rounded-3"
                style={{ height: "30px", width: "30px" }}
              >
                <TbCircleCheck size={16} />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md="2">
        <Card className="shadow">
          <CardBody className="d-flex justify-content-between">
            <div>
              <h6>Overdue</h6>
              <h2>1</h2>
            </div>
            <div>
              <span
                className="d-flex justify-content-center bg-light-danger rounded-3"
                style={{ height: "30px", width: "30px" }}
              >
                <FaExclamationTriangle size={16} />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md="2">
        <Card className="shadow">
          <CardBody className="d-flex justify-content-between">
            <div>
              <h6>Due Today</h6>
              <h2>0</h2>
            </div>
            <div>
              <span
                className="d-flex justify-content-center bg-light-warning rounded-3"
                style={{ height: "30px", width: "30px" }}
              >
                <TbClock size={16} />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md="2">
        <Card className="shadow">
          <CardBody className="d-flex justify-content-between">
            <div>
              <h6>This Week</h6>
              <h2>0</h2>
            </div>
            <div>
              <span
                className="d-flex justify-content-center bg-light-info rounded-3"
                style={{ height: "30px", width: "30px" }}
              >
                <TbCalendar size={16} />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col md="2">
        <Card className="shadow">
          <CardBody className="d-flex justify-content-between">
            <div>
              <h6>Completion Rate</h6>
              <h2>17%</h2>
            </div>
            <div>
              <span
                className="d-flex justify-content-center bg-light-success rounded-3"
                style={{ height: "30px", width: "30px" }}
              >
                <TrendingUp size={16} />
              </span>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default TasksAndRemindersOverview;
