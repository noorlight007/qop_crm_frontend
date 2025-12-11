import { CommonAdviserSummaryProps } from "@/Types/Network/Adviser/DashboardTypes";
import { TbCheckbox, TbClock, TbUsers } from "react-icons/tb";
import { Card, CardBody, CardTitle, Col, Row, Spinner } from "reactstrap";

const DashboardOverview: React.FC<CommonAdviserSummaryProps> = ({
  isLoading,
  adviserSummaryData,
}) => {
  return (
    <Row>
      {/* New Clients This Month  */}
      <Col lg>
        <Card className="border-0 p-2 rounded-2 shadow-sm bg-white">
          <CardBody className="p-3">
            <div className="d-flex justify-content-between">
              <div>
                <CardTitle className="small text-muted">
                  New Clients This Month
                </CardTitle>
                {isLoading ? (
                  <div className="d-flex align-items-center">
                    <Spinner color="primary" size="sm" />
                    <span className="text-muted ms-2">Loading...</span>
                  </div>
                ) : (
                  <h4 className="mb-1 text-dark">
                    {adviserSummaryData?.new_clients_this_month || 0}
                  </h4>
                )}
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

      {/* Case Completed */}
      <Col lg>
        <Card className="border-0 p-2 rounded-2 shadow-sm bg-white">
          <CardBody className="p-3">
            <div className="d-flex justify-content-between">
              <div>
                <CardTitle className="small text-muted text-truncate">
                  Case Completed
                </CardTitle>
                {isLoading ? (
                  <div className="d-flex align-items-center">
                    <Spinner color="secondary" size="sm" />
                    <span className="text-muted ms-2">Loading...</span>
                  </div>
                ) : (
                  <h4 className="mb-1 text-dark">
                    {adviserSummaryData?.completed_cases || 0}
                  </h4>
                )}
              </div>
              <div>
                <span
                  className="d-flex justify-content-center align-items-center bg-secondary rounded-3"
                  style={{ width: "30px", height: "30px" }}
                >
                  <TbCheckbox className="fs-6" />
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      {/* Upcoming Tasks */}
      <Col lg>
        <Card className="border-0 p-2 rounded-2 shadow-sm bg-white">
          <CardBody className="p-3">
            <div className="d-flex justify-content-between">
              <div>
                <CardTitle className="small text-muted text-truncate">
                  Upcoming Tasks
                </CardTitle>
                {isLoading ? (
                  <div className="d-flex align-items-center">
                    <Spinner color="primary" size="sm" />
                    <span className="text-muted ms-2">Loading...</span>
                  </div>
                ) : (
                  <h4 className="mb-1 text-dark">
                    {adviserSummaryData?.upcoming_tasks || 0}
                  </h4>
                )}
              </div>
              <div>
                <span
                  className="d-flex justify-content-center align-items-center bg-primary rounded-3"
                  style={{ width: "30px", height: "30px" }}
                >
                  <TbClock className="fs-6" />
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardOverview;
