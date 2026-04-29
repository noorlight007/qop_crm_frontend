import LoadingGrow from "@/CommonComponent/LoadingGrow/LoadingGrow";
import { FetchSingleOrganisationProps } from "@/Types/Common/Organisations/OrganisationsTypes";
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";

const Overview: React.FC<FetchSingleOrganisationProps> = ({
  singleOrgDashboardData,
  isDashboardLoading,
}) => {
  return (
    <div>
      {isDashboardLoading ? (
        <Card className="d-flex justify-content-center align-items-center w-100 p-4">
          <LoadingGrow />
        </Card>
      ) : (
        <Card className="shadow-sm px-3 pt-4">
          <CardTitle>
            <h2>Overview</h2>
          </CardTitle>
          <CardBody>
            <Row>
              <Col md="12">
                <Card className="shadow pb-1">
                  <CardHeader>
                    <h3>Case Stages</h3>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="4" sm="12" className="d-flex flex-column">
                        <span className="text-muted">Enquiry:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts?.ENQUIRY || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column">
                        <span className="text-muted">Fact Find:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts?.FACT_FIND || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column">
                        <span className="text-muted">
                          Research &amp; Compliance:
                        </span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.RESEARCH_COMPLIANCE_CHECK || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">
                          Decision in Principle:
                        </span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.DECISION_IN_PRINCIPLE || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">
                          Full Mortgage Application:
                        </span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.FULL_MORTGAGE_APPLICATION || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">Submission:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts?.SUBMISSION || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">Offer from Bank:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.OFFER_FROM_BANK || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">Legal:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts?.LEGAL || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">Completion:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts?.COMPLETION || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">Future Opportunity:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.FUTURE_OPPORTUNITY || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">
                          Accept Waiting Start Date:
                        </span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.ACCEPT_WAITING_START_DATE || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">Accepted on Risk:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.ACCEPTED_ON_RISK || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">
                          Further Medical Required:
                        </span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.FURTHER_MEDICAL_REQUIRED || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column mt-3">
                        <span className="text-muted">Not Proceed:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.stage_counts
                            ?.NOT_PROCEED || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col md="12">
                <Card className="shadow h-100">
                  <CardHeader>
                    <h3>Case Category</h3>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="4" sm="12" className="d-flex flex-column">
                        <span className="text-muted">Mortgage:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.category_counts
                            ?.MORTGAGE || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column">
                        <span className="text-muted">Protection:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.category_counts
                            ?.PROTECTION || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                      <Col md="4" sm="12" className="d-flex flex-column">
                        <span className="text-muted">General Insurance:</span>
                        <span className="fw-bold">
                          {singleOrgDashboardData?.category_counts
                            ?.GENERAL_INSURANCE || (
                            <span className="text-muted">{0}</span>
                          )}
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Overview;
