import { TbCircleCheck, TbClock, TbUsers } from "react-icons/tb";
import { Badge, Card, CardBody } from "reactstrap";

const CampaignHistory: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>
            <TbUsers className="me-1" /> Campaign History
          </h3>
          <small>Track performance of your WhatsApp campaigns</small>
        </div>
        <div>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <TbCircleCheck className="fs-5 text-success" />
                </div>
                <div>
                  <h6 className="fw-semibold">First Time Buyer Campaign</h6>
                  <small className="text-muted">
                    Template: New Mortgage Offer
                  </small>
                </div>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <Badge color="primary">Sent: 156</Badge>
                  <Badge color="dark">Delivered: 154</Badge>
                  <Badge color="warning">Read: 89</Badge>
                  <Badge color="success">Replied: 12</Badge>
                </p>
                <small>2024-01-15</small>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <TbClock className="fs-5 text-primary" />
                </div>
                <div>
                  <h6 className="fw-semibold">Remortgage Reminders</h6>
                  <small className="text-muted">
                    Template: Annual Remortgage Review
                  </small>
                </div>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <Badge color="primary">Sent: 600</Badge>
                  <Badge color="dark">Delivered: 304</Badge>
                  <Badge color="warning">Read: 145</Badge>
                  <Badge color="success">Replied: 98</Badge>
                </p>
                <small>2024-01-16</small>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <TbCircleCheck className="fs-5 text-success" />
                </div>
                <div>
                  <h6 className="fw-semibold">Document Collection</h6>
                  <small className="text-muted">
                    Template: Document Request
                  </small>
                </div>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <Badge color="primary">Sent: 23</Badge>
                  <Badge color="dark">Delivered: 23</Badge>
                  <Badge color="warning">Read: 18</Badge>
                  <Badge color="success">Replied: 15</Badge>
                </p>
                <small>2024-01-18</small>
              </div>
            </CardBody>
          </Card>
        </div>
      </CardBody>
    </Card>
  );
};

export default CampaignHistory;
