import { CommonDirectorDashboardProps } from "@/Types/CommonComponents/CommonDirectorDashboard/CommonDirectorDashboardType";
import { TbBriefcase2Filled, TbCoinPound, TbUsers } from "react-icons/tb";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const DashboardOverview: React.FC<CommonDirectorDashboardProps> = ({
  isLoading,
  commonDirectorDashboardData,
}) => {
  return (
    <Row>
      {isLoading ? (
        // Skeleton Loaders
        [...Array(3)].map((_, index) => (
          <Col md className="mb-2" key={index}>
            <Card className="border-0 p-2 rounded-2 shadow">
              <CardBody className="p-2">
                <div className="d-flex justify-content-between">
                  <div style={{ width: "80%" }}>
                    <div
                      className="skeleton-loading mb-2"
                      style={{ width: "80%", height: "16px" }}
                    />
                    <div
                      className="skeleton-loading mb-2"
                      style={{ width: "10%", height: "24px" }}
                    />
                    <div
                      className="skeleton-loading"
                      style={{ width: "50%", height: "16px" }}
                    />
                  </div>
                  <div
                    className="skeleton-loading rounded-3"
                    style={{ width: "30px", height: "30px" }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        ))
      ) : (
        // Render actual performance cards
        <>
          <Col md>
            <Card className="border-0 shadow">
              <CardBody className="p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <CardTitle className="small text-muted text-truncate">
                      Total Advisers
                    </CardTitle>
                    <h4 className="mb-1 text-dark">
                      {commonDirectorDashboardData?.counters?.total_advisers}
                    </h4>
                  </div>
                  <div>
                    <span
                      className="d-flex justify-content-center align-items-center bg-primary rounded-3"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <TbUsers className="fs-6" />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Active Clients */}
          <Col md>
            <Card className="border-0 shadow">
              <CardBody className="p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <CardTitle className="small text-muted text-truncate">
                      Active Clients
                    </CardTitle>
                    <h4 className="mb-1 text-dark">
                      {commonDirectorDashboardData?.counters?.total_clients}
                    </h4>
                  </div>
                  <div>
                    <span
                      className="d-flex justify-content-center align-items-center bg-secondary rounded-3"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <TbBriefcase2Filled className="fs-6" />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Revenue This Month */}
          <Col md>
            <Card className="border-0 shadow">
              <CardBody className="p-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <CardTitle className="small text-muted text-truncate">
                      Revenue This Month
                    </CardTitle>
                    <h4 className="mb-1 text-dark">£67,000</h4>
                  </div>
                  <div>
                    <span
                      className="d-flex justify-content-center align-items-center bg-success rounded-3"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <TbCoinPound className="fs-6" />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </>
      )}
    </Row>
  );
};

export default DashboardOverview;
