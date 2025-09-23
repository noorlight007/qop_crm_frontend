import { Card, CardBody, Col } from "reactstrap";

const SystemAlerts: React.FC = () => {
  return (
    <Col md="6" sm="12">
      <Card className="shadow-sm">
        <CardBody>
          {/* Header */}
          <div className="d-flex align-items-center mb-3">
            <span className="me-2 fs-5 text-warning">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </span>
            <h3 className="mb-0">System Alerts</h3>
          </div>

          {/* Alert Item 1 - Critical */}
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-start">
                <span className="bg-danger me-1 mt-2 p-1 rounded-circle"></span>
                <div>
                  <p className="mb-1 fw-bold text-dark">
                    Integration timeout with Lender API #3
                  </p>

                  <small className="text-muted">2 min ago</small>
                </div>
              </div>
              <span className="badge bg-danger ms-2">Critical</span>
            </div>
          </div>

          {/* Alert Item 2 - Warning */}
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-start">
                <span className="bg-warning me-1 mt-2 p-1 rounded-circle"></span>
                <div>
                  <p className="mb-1 fw-bold text-dark">
                    High CPU usage on server cluster
                  </p>
                  <small className="text-muted">15 min ago</small>
                </div>
              </div>
              <span className="badge bg-warning text-dark ms-2">Warning</span>
            </div>
          </div>

          {/* Alert Item 3 - Info */}
          <div className="p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-start">
                <span className="bg-primary me-1 mt-2 p-1 rounded-circle"></span>
                <div>
                  <p className="mb-1 fw-bold text-dark">
                    Scheduled maintenance completed
                  </p>
                  <small className="text-muted">1 hour ago</small>
                </div>
              </div>
              <span className="badge bg-primary ms-2">Info</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default SystemAlerts;
