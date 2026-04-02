import getCurrencySign from "@/utils/currency";
import { FaRegChartBar } from "react-icons/fa";
import { TbCoinPound, TbEye, TbTrendingUp, TbUsers } from "react-icons/tb";
import { Badge, Card, CardBody, Col, Row } from "reactstrap";

const MarketingAnalyticsOverview: React.FC = () => {
  return (
    <Card>
      <CardBody className="pb-0">
        <div className="mb-3">
          <h3>
            <FaRegChartBar className="me-1" />
            Marketing Analytics Overview
          </h3>
          <small>Track performance across all your marketing channels</small>
        </div>
        <div>
          <Row>
            <Col md="3">
              <Card className="shadow">
                <CardBody className="d-flex justify-content-between">
                  <div>
                    <h6>Total Reach</h6>
                    <h2>26.6k</h2>
                    <Badge className="bg-light-primary">
                      +18% vs last month
                    </Badge>
                  </div>
                  <div>
                    <span
                      className="bg-light-primary rounded-3 d-flex align-items-center justify-content-center"
                      style={{ height: "30px", width: "30px" }}
                    >
                      <TbEye />
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="shadow">
                <CardBody className="d-flex justify-content-between">
                  <div>
                    <h6>Engagement Rate</h6>
                    <h2>4.8%</h2>
                    <Badge className="bg-light-secondary">
                      +0.8% vs last month
                    </Badge>
                  </div>
                  <div>
                    <span
                      className="bg-light-secondary rounded-3 d-flex align-items-center justify-content-center"
                      style={{ height: "30px", width: "30px" }}
                    >
                      <TbTrendingUp />
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="shadow">
                <CardBody className="d-flex justify-content-between">
                  <div>
                    <h6>Total Leads</h6>
                    <h2>143</h2>
                    <Badge className="bg-light-success">
                      +28% vs last month
                    </Badge>
                  </div>
                  <div>
                    <span
                      className="bg-light-success rounded-3 d-flex align-items-center justify-content-center"
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
                <CardBody className="d-flex justify-content-between">
                  <div>
                    <h6>Cost Per Lead</h6>
                    <h2>{getCurrencySign()}12.50</h2>
                    <Badge className="bg-light-info">+12% vs last month</Badge>
                  </div>
                  <div>
                    <span
                      className="bg-light-info rounded-3 d-flex align-items-center justify-content-center"
                      style={{ height: "30px", width: "30px" }}
                    >
                      <TbCoinPound />
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  );
};

export default MarketingAnalyticsOverview;
