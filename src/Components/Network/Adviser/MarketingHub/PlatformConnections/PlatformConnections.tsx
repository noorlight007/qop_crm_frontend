import {
  TbArrowUp,
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandTwitter,
} from "react-icons/tb";
import { Card, Col, Row } from "reactstrap";

const PlatformConnections: React.FC = () => {
  return (
    <Row>
      <Col>
        <Card className="border-0 shadow-sm">
          <div className="p-3">
            <h3 className="d-flex align-items-center">
              <TbArrowUp className="me-2" />
              Platform Connections
            </h3>
            <p className="text-muted mb-0">
              Manage your social media integrations
            </p>
          </div>
          <div className="p-3 pb-0">
            <Row className="g-3">
              <Col md={3}>
                <Card className="border-0 px-2 py-3 shadow ">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TbBrandFacebook className="me-1 fs-5" />
                      <span>Facebook</span>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary rounded-pill px-2 py-1 mb-1">
                        Connected
                      </span>
                      <p className="text-muted mb-0 small">15 leads</p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 px-2 py-3 shadow">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TbBrandInstagram className="me-1 fs-5" />
                      <span>Instagram</span>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary rounded-pill px-2 py-1 mb-1">
                        Connected
                      </span>
                      <p className="text-muted mb-0 small">8 leads</p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 px-2 py-3 shadow ">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TbBrandLinkedin className="me-1 fs-5" />
                      <span>LinkedIn</span>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-light-dark text-muted rounded-pill px-2 py-1 mb-1">
                        Disconnected
                      </span>
                      <p className="text-muted mb-0 small">0 leads</p>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 px-2 py-3 shadow">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <TbBrandTwitter className="me-1 fs-5" />
                      <span>Twitter</span>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-light-dark text-muted rounded-pill px-2 py-1 mb-1">
                        Disconnected
                      </span>
                      <p className="text-muted mb-0 small">0 leads</p>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default PlatformConnections;
