import { TbMessage2, TbUsers } from "react-icons/tb";
import { Badge, Button, Card, CardBody } from "reactstrap";

const WhatsAppContactList: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>
            <TbUsers className="me-1" /> WhatsApp Contact List
          </h3>
          <small>Manage your CRM contacts for WhatsApp marketing</small>
        </div>
        <div>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <span className="bg-light-success rounded-3 p-2">
                    <TbMessage2 className="fs-5 text-success" />
                  </span>
                </div>
                <div>
                  <h6 className="fw-semibold">Sakura Haruno</h6>
                  <small className="text-muted">+44 7700 900123</small>
                </div>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <Badge color="primary">Lead</Badge>
                </p>
                <small>Last: 2 days ago</small>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <span className="bg-light-success rounded-3 p-2">
                    <TbMessage2 className="fs-5 text-success" />
                  </span>
                </div>
                <div>
                  <h6 className="fw-semibold">Saske Uchiha</h6>
                  <small className="text-muted">+44 7700 900124</small>
                </div>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <Badge color="success">Client</Badge>
                </p>
                <small>Last: 1 week ago</small>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <span className="bg-light-success rounded-3 p-2">
                    <TbMessage2 className="fs-5 text-success" />
                  </span>
                </div>
                <div>
                  <h6 className="fw-semibold">Sarah Wilson</h6>
                  <small className="text-muted">+44 7700 900126</small>
                </div>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <Badge color="warning">Prospect</Badge>
                </p>
                <small>Last: 4 days ago</small>
              </div>
            </CardBody>
          </Card>
          <Card className="shadow">
            <CardBody className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <div>
                  <span className="bg-light-success rounded-3 p-2">
                    <TbMessage2 className="fs-5 text-success" />
                  </span>
                </div>
                <div>
                  <h6 className="fw-semibold">Eno</h6>
                  <small className="text-muted">+44 7700 900125</small>
                </div>
              </div>
              <div className="text-end">
                <p className="mb-1">
                  <Badge color="success">Client</Badge>
                </p>
                <small>Last: 5 days ago</small>
              </div>
            </CardBody>
          </Card>
          <Button outline color="primary" className="w-100">
            Import from CRM
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default WhatsAppContactList;
