import { FaRegClock } from "react-icons/fa";
import { TbMessage2, TbSend } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

const ComposeWhatsAppMessage: React.FC = () => {
  return (
    <Card className="rounded-3" style={{ height: "97%" }}>
      <CardBody>
        <div className="mb-3">
          <h3>
            <TbMessage2 className="me-1" />
            Compose WhatsApp Message
          </h3>
          <small>
            Send individual or bulk WhatsApp messages to your CRM contacts
          </small>
        </div>

        <Form>
          <FormGroup>
            <Label for="messageTemplate">Message Template</Label>
            <Input
              type="select"
              name="messageTemplate"
              id="messageTemplate"
              className="mb-2"
            >
              <option value="">
                Choose a template or write custom message
              </option>
              <option value="newMortgageOffer">New Mortgage Offer</option>
              <option value="appointmentReminder">Appointment Reminder</option>
              <option value="thankYouMessage">Thank You Message</option>
              <option value="documentRequest">Document Request</option>
              <option value="annualRemortgageReview">
                Annual Remortgage Review
              </option>
              <option value="protectionDiscussion">
                Protection Discussion
              </option>
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="exampleTextarea">Message</Label>
            <Input type="textarea" name="textarea" id="exampleTextarea" />
          </FormGroup>
          <FormGroup>
            <Label for="recipient">Recipients</Label>
            <Input
              type="select"
              name="recipient"
              id="recipient"
              placeholder="Enter recipient"
            >
              <option value="">All Contacts</option>
              <option value="LEAD_ONLY">Leads Only</option>
              <option value="CLIENTS_ONLY">Clients Only</option>
              <option value="PROSPECTS_ONLY">Prospects Only</option>
            </Input>
          </FormGroup>
          <Row>
            <Col md="9" className="pe-1">
              <Button className="w-100" color="primary">
                <TbSend className="me-1" />
                Send Message
              </Button>
            </Col>
            <Col md="3" className="ps-1">
              <Button className="w-100">
                <FaRegClock className="me-1" />
                Schedule
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ComposeWhatsAppMessage;
