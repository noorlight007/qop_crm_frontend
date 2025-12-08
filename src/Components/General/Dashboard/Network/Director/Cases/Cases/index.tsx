import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/General/Dashboard/CommonComponents/Cases/Cases";
import { Container, Row } from "reactstrap";

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
