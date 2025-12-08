import { Card, CardBody, Col, Row } from "reactstrap";

const AdviserTaskOverview = () => {
  return (
    <Card className="border-0 p-3 rounded-2 shadow-sm bg-white mt-4">
      <h5 className="mb-3">Adviser Task Overview</h5>
      <Row>
        <Col md={3}>
          <Card className="mb-4 bg-light-dark">
            <CardBody>
              <h5 className="mb-3">Sarah Johnson</h5>
              <p>Total Tasks: 12</p>
              <p>
                <span style={{ color: "green" }}>Completed: 8</span>
              </p>
              <p>
                <span style={{ color: "red" }}>Overdue: 1</span>
              </p>
              <p>Efficiency: 85%</p>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 bg-light-dark">
            <CardBody>
              <h5 className="mb-3">Michael Chen</h5>
              <p>Total Tasks: 9</p>
              <p>
                <span style={{ color: "green" }}>Completed: 7</span>
              </p>
              <p>
                <span style={{ color: "red" }}>Overdue: 0</span>
              </p>
              <p>Efficiency: 92%</p>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 bg-light-dark">
            <CardBody>
              <h5 className="mb-3">Emma Williams</h5>
              <p>Total Tasks: 15</p>
              <p>
                <span style={{ color: "green" }}>Completed: 10</span>
              </p>
              <p>
                <span style={{ color: "red" }}>Overdue: 2</span>
              </p>
              <p>Efficiency: 78%</p>
            </CardBody>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 bg-light-dark">
            <CardBody>
              <h5 className="mb-3">James Wilson</h5>
              <p>Total Tasks: 8</p>
              <p>
                <span style={{ color: "green" }}>Completed: 6</span>
              </p>
              <p>
                <span style={{ color: "red" }}>Overdue: 1</span>
              </p>
              <p>Efficiency: 88%</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default AdviserTaskOverview;
