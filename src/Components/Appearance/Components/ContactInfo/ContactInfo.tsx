import { Edit } from "react-feather";
import { Button, Card, CardBody, CardHeader } from "reactstrap";

const ContactInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <h3 className="card-title">Contact Info</h3>
        <Button color="primary" size="sm">
          <Edit size={14} className="me-1" />
          Edit
        </Button>
      </CardHeader>
      <CardBody></CardBody>
    </Card>
  );
};

export default ContactInfo;
