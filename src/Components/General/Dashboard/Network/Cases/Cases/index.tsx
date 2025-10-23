import { Container, Row } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "../../../CommonComponents/Cases/Cases";

const NetworkCaseContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Cases Status"
        subTitle="Here you can see all the cases of the network"
        parent="Cases"
        child="All Cases"
      />
      <Container fluid>
        <Row>
          <Cases />
        </Row>
      </Container>
    </>
  );
};

export default NetworkCaseContainer;
