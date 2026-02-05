import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import AdviserList from "./AdviserList/AdviserList";

const AdminAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Advisers Overview"
        subTitle="Welcome back! Check all the Advisers"
        parent="Users"
        child="Advisers"
      />
      <Container fluid>
        <Row>
          <AdviserList />
        </Row>
      </Container>
    </>
  );
};

export default AdminAdvisersContainer;
