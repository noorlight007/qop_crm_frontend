import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import RemortgageCalculator from "@/Components/Common/Calculators/RemortgageCalculator/RemortgageCalculator";
import { Container } from "reactstrap";

const RemortgageCalculatorContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Remortgage Calculator"
        subTitle="Calculate your remortgage payments with ease"
        items={[
          { label: "Calculators" },
          { label: "Remortgage Calculator", active: true },
        ]}
      />
      <Container fluid>
        <RemortgageCalculator />
      </Container>
    </>
  );
};

export default RemortgageCalculatorContainer;
