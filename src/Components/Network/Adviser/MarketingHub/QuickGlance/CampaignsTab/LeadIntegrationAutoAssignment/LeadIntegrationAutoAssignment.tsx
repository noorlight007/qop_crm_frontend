import { FaChartBar } from "react-icons/fa";
import { TbArrowNarrowRight } from "react-icons/tb";
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";

const LeadIntegrationAutoAssignment: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>
            <FaChartBar className="me-1" />
            Lead Integration Auto Assignment
          </h3>
          <small>
            Configure how leads are automatically processed and assigned
          </small>
        </div>
        <div>
          <Row>
            <Col md="6">
              <h5 className="mb-1">Auto-Assignment Rules</h5>
              <div>
                <div className="d-flex justify-content-between p-2 mb-2 bg-light-dark rounded-1">
                  <small>First Time Buyer leads</small>
                  <strong className="small">
                    <TbArrowNarrowRight />
                    Kiba Adesanya
                  </strong>
                </div>
                <div className="d-flex justify-content-between p-2 mb-2 bg-light-dark rounded-1">
                  <small>Remortgage leads</small>
                  <strong className="small">
                    <TbArrowNarrowRight />
                    Sino Aburame
                  </strong>
                </div>
                <div className="d-flex justify-content-between p-2 mb-2 bg-light-dark rounded-1">
                  <small>Buy to Let leads</small>
                  <strong className="small">
                    <TbArrowNarrowRight />
                    Sand of the Gara
                  </strong>
                </div>
                <div className="d-flex justify-content-between p-2 mb-2 bg-light-dark rounded-1">
                  <small>First Time Buyer leads</small>
                  <strong className="small">
                    <TbArrowNarrowRight />
                    Sikadai Nara
                  </strong>
                </div>
                <Button outline color="dark">
                  Manage Rules
                </Button>
              </div>
            </Col>
            <Col md="6">
              <h5 className="mb-1">Auto-Assignment Rules</h5>
              <div>
                <div className="d-flex justify-content-between p-2 mb-2 bg-light-success rounded-1">
                  <small className="text-dark">Call within 1 hour</small>
                  <Badge color="success">Active</Badge>
                </div>
                <div className="d-flex justify-content-between p-2 mb-2 bg-light-success rounded-1">
                  <small className="text-dark">Send welcome email</small>
                  <Badge color="dark">InActive</Badge>
                </div>
                <div className="d-flex justify-content-between p-2 mb-2 bg-light-success rounded-1">
                  <small className="text-dark">Schedule consultation</small>
                  <Badge color="success">Active</Badge>
                </div>
                <Button outline color="dark">
                  Configure Rules
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default LeadIntegrationAutoAssignment;
