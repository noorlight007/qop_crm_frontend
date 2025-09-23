import { CommonDashboardProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import React from "react";
import { TbFileInvoice } from "react-icons/tb";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const PerformanceOverview: React.FC<CommonDashboardProps> = ({
  isLoading,
  commonDashboardData,
}) => {
  return (
    <>
      <Row className="py-2">
        {isLoading ? (
          // Skeleton Loaders
          [...Array(5)].map((_, index) => (
            <Col lg key={index} className="mb-2">
              <Card className="border-0 p-2 rounded-2 shadow-sm bg-white">
                <CardBody className="p-2">
                  <div className="d-flex justify-content-between">
                    <div style={{ width: "70%" }}>
                      <div
                        className="skeleton-loading mb-2"
                        style={{
                          width: "80%",
                          height: "16px",
                          backgroundColor: "#e0e0e0",
                        }}
                      />
                      <div
                        className="skeleton-loading"
                        style={{
                          width: "50%",
                          height: "24px",
                          backgroundColor: "#e0e0e0",
                        }}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))
        ) : (
          // Render actual performance cards
          <>
            <Col lg>
              <Card className="border-0 shadow">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="text-muted small fw-bold text-truncate">
                        New Mortgage Enquiry
                      </CardTitle>
                      <h4 className="mb-1 text-dark">
                        {commonDashboardData?.summary_cards
                          ?.new_mortgage_enquiry ?? 0}
                      </h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-dark rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileInvoice className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg>
              <Card className="border-0 shadow">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="text-muted small fw-bold text-truncate">
                        Mortgage Cases Submitted
                      </CardTitle>
                      <h4 className="mb-1 text-dark">
                        {commonDashboardData?.summary_cards
                          ?.mortgage_cases_submitted ?? 0}
                      </h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-dark rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileInvoice className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg>
              <Card className="border-0 shadow">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="text-muted small fw-bold text-truncate">
                        Mortgage Cases Offered
                      </CardTitle>
                      <h4 className="mb-1 text-dark">
                        {commonDashboardData?.summary_cards
                          ?.mortgage_cases_offered ?? 0}
                      </h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-dark rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileInvoice className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg>
              <Card className="border-0 shadow">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="text-muted small fw-bold text-truncate">
                        Mortgage Cases Completed
                      </CardTitle>
                      <h4 className="mb-1 text-dark">
                        {commonDashboardData?.summary_cards
                          ?.mortgage_cases_completed ?? 0}
                      </h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-dark rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileInvoice className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg>
              <Card className="border-0 shadow">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between">
                    <div>
                      <CardTitle className="text-muted small fw-bold text-truncate">
                        Insurance Cases Submitted
                      </CardTitle>
                      <h4 className="mb-1 text-dark">
                        {commonDashboardData?.summary_cards
                          ?.insurance_cases_submitted ?? 0}
                      </h4>
                    </div>
                    <div>
                      <span
                        className="d-flex justify-content-center align-items-center bg-light-dark rounded-3"
                        style={{ width: "30px", height: "30px" }}
                      >
                        <TbFileInvoice className="fs-6" />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export default PerformanceOverview;
