import {
  TbCirclePlusFilled,
  TbCoinPound,
  TbTarget,
  TbTrendingUp,
  TbUsers,
} from "react-icons/tb";
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";

const LeadAdCampaigns: React.FC = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Lead Ad Campaigns</h3>
          <small>
            Create and manage Facebook, Instagram & LinkedIn lead ads
          </small>
        </div>
        <Button color="primary">
          Create Campaign
          <TbCirclePlusFilled className="ms-1 fs-6" />
        </Button>
      </div>
      <div>
        <Row>
          <Col md="3">
            <Card className="shadow">
              <CardBody className="d-flex justify-content-between p-2">
                <div>
                  <p className="mb-1">Total Leads</p>
                  <h4>1,234</h4>
                  <Badge className="bg-light-dark">+22% this month</Badge>
                </div>
                <div>
                  <span
                    className="bg-primary rounded-3 d-flex justify-content-center"
                    style={{ height: "30px", width: "30px" }}
                  >
                    <TbUsers />
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card className="shadow">
              <CardBody className="d-flex justify-content-between p-2">
                <div>
                  <p className="mb-1">Total Spent</p>
                  <h4>£992</h4>
                  <Badge className="bg-light-dark">£1,600 budget</Badge>
                </div>
                <div>
                  <span
                    className="bg-success rounded-3 d-flex justify-content-center"
                    style={{ height: "30px", width: "30px" }}
                  >
                    <TbCoinPound />
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card className="shadow">
              <CardBody className="d-flex justify-content-between p-2">
                <div>
                  <p className="mb-1">Avg Cost Per Lead</p>
                  <h4>£28.34</h4>
                  <Badge className="bg-light-dark">Industry avg: £45</Badge>
                </div>
                <div>
                  <span
                    className="bg-warning rounded-3 d-flex justify-content-center"
                    style={{ height: "30px", width: "30px" }}
                  >
                    <TbTarget />
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="3">
            <Card className="shadow">
              <CardBody className="d-flex justify-content-between p-2">
                <div>
                  <p className="mb-1">Conversion Rate</p>
                  <h4>7.3%</h4>
                  <Badge className="bg-light-dark">+1.2% vs last month</Badge>
                </div>
                <div>
                  <span
                    className="bg-info rounded-3 d-flex justify-content-center"
                    style={{ height: "30px", width: "30px" }}
                  >
                    <TbTrendingUp />
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LeadAdCampaigns;
