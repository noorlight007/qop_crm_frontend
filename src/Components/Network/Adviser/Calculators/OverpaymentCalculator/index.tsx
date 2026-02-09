import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OverpaymentCalculator from "@/Components/Common/Calculators/OverpaymentCalculator/OverpaymentCalculator";
import { Container } from "reactstrap";

const OverpaymentCalculatorContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Overpayment Calculator"
        subTitle="Calculate your overpayment savings with ease"
        parent="Calculator"
        child="Overpayment Calculator"
      />
      <Container fluid>
        <OverpaymentCalculator />
      </Container>
    </>
  );
};

export default OverpaymentCalculatorContainer;
