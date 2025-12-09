import { TbUsers } from "react-icons/tb";
import { Badge, Button, Card, CardBody } from "reactstrap";

const TeamPermissions: React.FC = () => {
  return (
    <Card>
      <CardBody className="pb-0">
        <div>
          <h3>
            <TbUsers className="me-2" />
            Team Permissions
          </h3>
          <p>Manage platform access for team members</p>
        </div>
      </CardBody>
      <CardBody>
        <div className="d-flex justify-content-between align-items-center p-2 border-1 border-light rounded-3 shadow-sm mb-3">
          <div>
            <h5>Jhon Smith(You)</h5>
            <small>Administrator</small>
          </div>
          <div>
            <Badge color="primary" className="ms-2">
              All Platforms
            </Badge>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center p-2 border-1 border-light rounded-3 shadow-sm mb-3">
          <div>
            <h5>Jhon Smith(You)</h5>
            <small>Administrator</small>
          </div>
          <div>
            <Badge color="dark" className="ms-2">
              Facebook, Instagram
            </Badge>
          </div>
        </div>
        <Button outline color="primary" className="w-100 mb-2">
          <TbUsers className="me-1" />
          Manage Team Access
        </Button>
      </CardBody>
    </Card>
  );
};

export default TeamPermissions;
