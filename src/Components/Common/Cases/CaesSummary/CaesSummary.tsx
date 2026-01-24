import { useGetCasesSummaryQuery } from "@/Redux/Reducers/CommonComponents/Cases/CaesSummaryApi";
import { TbFileDescription } from "react-icons/tb";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const CaesSummary: React.FC = () => {
  const { data: casesSummaryData, isLoading } =
    useGetCasesSummaryQuery(undefined);

  const summary: any =
    (Array.isArray(casesSummaryData)
      ? casesSummaryData[0]
      : casesSummaryData) || {};

  return (
    <Row>
      {isLoading ? (
        <>
          {[...Array(4)].map((_, index) => (
            <Col md="3" className="mb-2" key={index}>
              <Card className="border-0 p-2 rounded-2 shadow-sm bg-white">
                <CardBody className="p-2">
                  <div className="d-flex justify-content-between">
                    <div style={{ width: "70%" }}>
                      <div
                        className="skeleton-loading mb-2"
                        style={{ width: "80%", height: "16px" }}
                      />
                      <div
                        className="skeleton-loading"
                        style={{ width: "50%", height: "24px" }}
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
          ))}
        </>
      ) : (
        // Actual Content
        <>
          {/* All Cases  */}
          <Col md="3">
            <Card className="p-2 shadow">
              <CardBody className="p-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <CardTitle className="small text-muted">
                      All Cases
                    </CardTitle>
                    <h4 className="mb-1 text-dark">{summary.all_cases || 0}</h4>
                  </div>
                  <div>
                    <span
                      className="d-flex justify-content-center align-items-center bg-light-primary rounded-3"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <TbFileDescription className="fs-6" />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Active Cases  */}
          <Col md="3">
            <Card className="p-2 shadow">
              <CardBody className="p-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <CardTitle className="small text-muted">
                      Active Cases
                    </CardTitle>
                    <h4 className="mb-1 text-dark">
                      {summary.active_cases || 0}
                    </h4>
                  </div>
                  <div>
                    <span
                      className="d-flex justify-content-center align-items-center bg-light-success rounded-3"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <TbFileDescription className="fs-6" />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Pending Cases  */}
          <Col md="3">
            <Card className="p-2 shadow">
              <CardBody className="p-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <CardTitle className="small text-muted">
                      Pending Cases
                    </CardTitle>
                    <h4 className="mb-1 text-dark">
                      {summary.pending_cases || 0}
                    </h4>
                  </div>
                  <div>
                    <span
                      className="d-flex justify-content-center align-items-center bg-light-warning rounded-3"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <TbFileDescription className="fs-6" />
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          {/* Completed Cases  */}
          <Col md="3">
            <Card className="p-2 shadow">
              <CardBody className="p-2">
                <div className="d-flex justify-content-between">
                  <div>
                    <CardTitle className="small text-muted">
                      Completed Cases
                    </CardTitle>
                    <h4 className="mb-1 text-dark">
                      {summary.completed_cases || 0}
                    </h4>
                  </div>
                  <div>
                    <span
                      className="d-flex justify-content-center align-items-center bg-light-info rounded-3"
                      style={{ width: "30px", height: "30px" }}
                    >
                      <TbFileDescription className="fs-6" />
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

export default CaesSummary;
