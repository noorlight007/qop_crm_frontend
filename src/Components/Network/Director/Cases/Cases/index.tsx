import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import Cases from "@/Components/General/Dashboard/CommonComponents/Cases/Cases";
import { Container, Row } from "reactstrap";

const NetworkDirectorCasesContainer: React.FC = () => {
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

export default NetworkDirectorCasesContainer;
