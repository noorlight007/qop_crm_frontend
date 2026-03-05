import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import StampDutyCalculator from "@/Components/Common/Calculators/StampDutyCalculator/StampDutyCalculator";
import { Container } from "reactstrap";

const StampDutyCalculatorContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Stamp Duty Calculator"
        subTitle="Calculate your stamp duty payments with ease"
        items={[
          { label: "Calculators" },
          { label: "Stamp Duty Calculator", active: true },
        ]}
      />
      <Container fluid>
        <StampDutyCalculator />
      </Container>
    </>
  );
};

export default StampDutyCalculatorContainer;
