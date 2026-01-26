import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import DirectorList from "./DirectorList/DirectorList";

const AdminDirectorsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Director List"
        subTitle="Welcome back! Check all the Network Directors"
        parent="Client"
        child="Dashboard"
      />
      <Container fluid>
        <Row>
            <DirectorList />
        </Row>
      </Container>
    </>
  );
};

export default AdminDirectorsContainer;
