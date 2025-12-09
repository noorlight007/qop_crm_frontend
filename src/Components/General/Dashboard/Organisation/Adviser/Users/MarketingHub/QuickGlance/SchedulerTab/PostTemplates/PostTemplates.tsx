import { Badge, Button, Card, CardBody } from "reactstrap";

const PostTemplates: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>Post Templates</h3>
          <small>Quick start with pre-built content templates</small>
        </div>
        <div>
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-1">First Time Buyer Tips</h5>
                <Badge color="dark">Educational</Badge>
              </div>
              <p className="text-truncate mb-0">
                First-time buyer? Here are our top tips for getting your first
                mortgage...
              </p>
              <small className="text-info">
                #FirstTimeBuyer #Mortgage #PropertyTips
              </small>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-1">Remortgage Reminder</h5>
                <Badge color="dark">Promotional</Badge>
              </div>
              <p className="text-truncate mb-0">
                Is your mortgage deal ending soon? Don't let it roll onto the
                SVR...
              </p>
              <small className="text-info">
                #Remortgage #MortgageDeals #SaveMoney
              </small>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-1">Client Success Story</h5>
                <Badge color="dark">Testimonial</Badge>
              </div>
              <p className="text-truncate mb-0">
                Another happy client! We helped [Name] secure a fantastic
                mortgage deal...
              </p>
              <small className="text-info">
                #ClientSuccess #MortgageBroker #HappyClients
              </small>
            </CardBody>
          </Card>
          <Button outline color="dark" className="w-100">
            Create Template
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PostTemplates;
