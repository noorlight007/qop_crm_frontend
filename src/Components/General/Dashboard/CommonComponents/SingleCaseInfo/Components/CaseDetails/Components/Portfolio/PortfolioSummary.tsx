import { PropertiesTypeProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/PortfilioTypes";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

const PortfolioSummary: React.FC<{ data: PropertiesTypeProps[] }> = ({
  data,
}) => {
  // Calculate totals
  const totalPropertyValue = data?.reduce((sum, item) => {
    return sum + Number(item.property_value);
  }, 0);
  const totalMortgageBalance = data?.reduce(
    (sum, item) => sum + Number(item.current_mortgage_balance),
    0
  );
  const totalMonthlyRental = data?.reduce(
    (sum, item) => sum + Number(item.monthly_rental_income),
    0
  );
  const totalMonthlyPayment = data?.reduce(
    (sum, item) => sum + (Number(item.monthly_mortgage_payment) || 0),
    0
  );

  // Calculate averages
  const averageLTV =
    totalMortgageBalance && totalPropertyValue
      ? (totalMortgageBalance / totalPropertyValue) * 100
      : 0;

  const averageICR = totalMonthlyPayment
    ? (totalMonthlyRental / totalMonthlyPayment) * 100
    : 0;

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
                  £{totalPropertyValue?.toLocaleString()}
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
                  £{totalMortgageBalance?.toLocaleString()}
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
                  {averageLTV?.toFixed(2)}%
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
                  £{totalMonthlyRental?.toLocaleString()}
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
                  £{totalMonthlyPayment?.toLocaleString()}
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
                  {averageICR?.toFixed(2)}%
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
