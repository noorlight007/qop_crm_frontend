import { useGetCreditCommitmentsSummaryQuery } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/CreditCommitmentsDetails/CreditCommitmentsSummaryApi";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const CreditCommitmentsSummary: React.FC = () => {
  const { casealias } = useParams();
  const { data: summaryData } = useGetCreditCommitmentsSummaryQuery({
    case_alias: casealias,
  });

  return (
    <div className="p-2">
      <Row>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-primary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold fs-6">Total Balance</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{summaryData?.total_balance || "0.00"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-secondary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Balance To Be Repaid</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-secondary h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-secondary font-weight-bold">
                  £{summaryData?.total_balance_to_be_repaid || "0.00"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-success">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Balance To Remain</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-success h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-success font-weight-bold">
                  £{summaryData?.total_balance_to_remain || "0.00"}
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
                <h6 className="fw-bold">Total Monthly Payment</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{summaryData?.total_monthly_payment || "0.00"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-secondary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Monthly Payment To Be Repaid</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-secondary h1">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                <span className="h2 text-secondary font-weight-bold">
                  £{summaryData?.total_monthly_payment_to_be_repaid || "0.00"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-success">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Monthly Payment To Remain</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-success h1">
                  <i className="fa-solid fa-calendar-days"></i>
                </span>
                <span className="h2 text-success font-weight-bold">
                  £{summaryData?.total_monthly_payment_to_remain || "0.00"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* 3r row  */}
      <Row>
        <Col lg="4" md="12">
          <Card className="shadow">
            <CardBody className="support-ticket-font pt-2 pb-3 border-3 rounded-3 border-b-primary">
              <CardHeader className="pt-0 pb-1 m-0 text-center">
                <h6 className="fw-bold">Total Settlement Balance</h6>
              </CardHeader>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="text-primary h1">
                  <i className="fa-solid fa-sterling-sign"></i>
                </span>
                <span className="h2 text-primary font-weight-bold">
                  £{summaryData?.total_settlement_balance || "0.00"}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreditCommitmentsSummary;
