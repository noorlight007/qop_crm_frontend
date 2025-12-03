import { useGetPortfolioSummaryQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Portfolio/PortfolioSummaryApi";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const PortfolioSummary: React.FC = () => {
  const { casealias } = useParams();
  const { data: portfolioSummary } = useGetPortfolioSummaryQuery({
    case_alias: casealias,
  });

  return (
    <>
      <Row>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-primary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Value of Properties</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-building"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{portfolioSummary?.total_property_value || "0"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-secondary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Current Mortgage Balance</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-secondary h1">
                  <i className="fa-solid fa-circle-info"></i>
                </span>
                <span className="h2 text-secondary font-weight-bold">
                  £{portfolioSummary?.total_current_mortgage_balance || "0"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-success">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">LTV %</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-success h1">
                  <i className="fa-solid fa-chart-line"></i>
                </span>
                <span className="h2 text-success font-weight-bold">
                  {portfolioSummary?.ltv || "0"}%
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* 2nd row  */}
      <Row>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-primary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Monthly Rental Income</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-users"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{portfolioSummary?.total_monthly_rental_income || "0"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-secondary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Monthly Mortgage Payment</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-secondary h1">
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
                <span className="h2 text-secondary font-weight-bold">
                  £{portfolioSummary?.total_monthly_mortgage_payment || "0"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-success">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">ICR %</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-success h1">
                  <i className="fa-solid fa-arrow-right-arrow-left"></i>
                </span>
                <span className="h2 text-success font-weight-bold">
                  {portfolioSummary?.icr || "0"}%
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PortfolioSummary;
