import { TbFileText } from "react-icons/tb";
import { Badge, Button, Card, CardBody } from "reactstrap";

const MessageTemplates: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>
            <TbFileText className="me-1" />
            Message Templates
          </h3>
          <small>Pre-built templates for common mortgage scenarios</small>
        </div>
        <div>
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between mb-2">
                <h5 className="fw-semibold">New Mortgage Offer</h5>
                <Badge>1 vars</Badge>
              </div>
              <p className="mb-1">
                Great news! We have a new mortgage offer for you with rates
                starting from 40%. Contact us to learn more!
              </p>
              <div>
                <Badge color="dark">rate</Badge>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between mb-2">
                <h5 className="fw-semibold">Appointment Reminder</h5>
                <Badge>3 vars</Badge>
              </div>
              <p className="mb-1">
                Hi Kakashi, this is a reminder of your mortgage consultation
                appointment tomorrow at 10:03. See you then!
              </p>
              <div>
                <Badge color="success">name</Badge>
                <Badge color="primary">time</Badge>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between mb-2">
                <h5 className="fw-semibold">Annual Remortgage Review</h5>
                <Badge>1 vars</Badge>
              </div>
              <p className="mb-1">
                Hi Sikamaru, it's time for your annual mortgage review. We may
                have better rates available. Call us to discuss!
              </p>
              <div>
                <Badge color="success">name</Badge>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between mb-2">
                <h5 className="fw-semibold">Document Request</h5>
                <Badge>2 vars</Badge>
              </div>
              <p className="mb-1">
                Hi Sakura, we need the following documents to proceed with your
                application: land documents. Please send them at your earliest
                convenience.
              </p>
              <div>
                <Badge color="success">name</Badge>
              </div>
            </CardBody>
          </Card>
          <Button outline color="dark" className="w-100">
            Create New Template
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default MessageTemplates;
