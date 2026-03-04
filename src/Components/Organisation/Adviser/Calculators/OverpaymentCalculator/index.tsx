import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OverpaymentCalculator from "@/Components/Common/Calculators/OverpaymentCalculator/OverpaymentCalculator";
import { Container } from "reactstrap";

const OverpaymentCalculatorContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Overpayment Calculator"
        subTitle="Calculate your overpayment savings with ease"
        items={[
          { label: "Calculator" },
          { label: "Overpayment Calculator", active: true },
        ]}
      />
      <Container fluid>
        <OverpaymentCalculator />
      </Container>
    </>
  );
};

export default OverpaymentCalculatorContainer;
