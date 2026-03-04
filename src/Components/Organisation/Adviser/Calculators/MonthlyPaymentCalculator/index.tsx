import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import MonthlyPaymentCalculator from "@/Components/Common/Calculators/MonthlyPaymentCalculator/MonthlyPaymentCalculator";
import { Container } from "reactstrap";

const MonthlyPaymentCalculatorContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Monthly Payment Calculator"
        subTitle="Calculate your monthly payments with ease"
        items={[
          { label: "Calculator" },
          { label: "Monthly Payment Calculator", active: true },
        ]}
      />
      <Container fluid>
        <MonthlyPaymentCalculator />
      </Container>
    </>
  );
};

export default MonthlyPaymentCalculatorContainer;
