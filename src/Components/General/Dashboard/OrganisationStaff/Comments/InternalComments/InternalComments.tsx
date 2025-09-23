import { Badge, Card, CardBody } from "reactstrap";

const InternalComments: React.FC = () => {
  return (
    <Card>
      <CardBody className="d-flex justify-content-between">
        <div>
          <h2>Internal Comments</h2>
          <small>Contextual commenting system for case coordination</small>
        </div>
        <div>
          <Badge color="dark">3 total</Badge>
          <Badge>1 unresolved</Badge>
        </div>
      </CardBody>
    </Card>
  );
};

export default InternalComments;
