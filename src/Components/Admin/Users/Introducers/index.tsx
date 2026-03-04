import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import IntroducerList from "./IntroducerList/IntroducerList";

const IntroducerContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Introducers Overview"
        subTitle="Welcome back! Check all the Introducerss"
        items={[{ label: "Users" }, { label: "Introducerss", active: true }]}
      />
      <Container fluid>
        <Row>
          <IntroducerList />
        </Row>
      </Container>
    </>
  );
};

export default IntroducerContainer;
