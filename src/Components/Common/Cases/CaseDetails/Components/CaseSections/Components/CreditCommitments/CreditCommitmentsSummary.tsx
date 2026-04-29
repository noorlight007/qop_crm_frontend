import { useGetCreditCommitmentsSummaryQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CreditCommitmentsDetails/CreditCommitmentsSummaryApi";
import getCurrencySign from "@/utils/currency";
import { useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

const CreditCommitmentsSummary: React.FC = () => {
  const { casealias } = useParams();
  const { data: summaryData } = useGetCreditCommitmentsSummaryQuery({
    case_alias: casealias,
  });

  const summaryCards = [
    {
      title: "Total Balance",
      value: summaryData?.total_balance,
      color: "primary",
      borderClass: "border-b-primary",
      iconClass: "fa-solid fa-sterling-sign",
    },
    {
      title: "Total Balance To Be Repaid",
      value: summaryData?.total_balance_to_be_repaid,
      color: "secondary",
      borderClass: "border-b-secondary",
      iconClass: "fa-solid fa-sterling-sign",
    },
    {
      title: "Total Balance To Remain",
      value: summaryData?.total_balance_to_remain,
      color: "success",
      borderClass: "border-b-success",
      iconClass: "fa-solid fa-sterling-sign",
    },
    {
      title: "Total Monthly Payment",
      value: summaryData?.total_monthly_payment,
      color: "primary",
      borderClass: "border-b-primary",
      iconClass: "fa-solid fa-calendar-days",
    },
    {
      title: "Total Monthly Payment To Be Repaid",
      value: summaryData?.total_monthly_payment_to_be_repaid,
      color: "secondary",
      borderClass: "border-b-secondary",
      iconClass: "fa-solid fa-calendar-days",
    },
    {
      title: "Total Monthly Payment To Remain",
      value: summaryData?.total_monthly_payment_to_remain,
      color: "success",
      borderClass: "border-b-success",
      iconClass: "fa-solid fa-calendar-days",
    },
    {
      title: "Total Settlement Balance",
      value: summaryData?.total_settlement_balance,
      color: "primary",
      borderClass: "border-b-primary",
      iconClass: "fa-solid fa-sterling-sign",
    },
    {
      title: "Total Debt Consolidation Balance",
      value: summaryData?.total_debt_consolidation_balance,
      color: "secondary",
      borderClass: "border-b-secondary",
      iconClass: "fa-solid fa-sterling-sign",
    },
  ];

  return (
    <div className="p-2">
      <Row>
        {summaryCards.map((card) => (
          <Col key={card.title} lg="4" md="12">
            <Card className="shadow">
              <CardBody
                className={`support-ticket-font pt-2 pb-3 border-3 rounded-3 ${card.borderClass}`}
              >
                <CardHeader className="pt-0 pb-1 m-0 text-center">
                  <h6 className="fw-bold fs-6">{card.title}</h6>
                </CardHeader>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className={`text-${card.color} h1`}>
                    <i className={card.iconClass}></i>
                  </span>
                  <span className={`h2 text-${card.color} font-weight-bold`}>
                    {getCurrencySign()}
                    {card.value || "0.00"}
                  </span>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CreditCommitmentsSummary;
