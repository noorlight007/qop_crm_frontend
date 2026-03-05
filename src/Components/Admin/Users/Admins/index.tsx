import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import AdminList from "./AdminList/AdminList";

const AdminsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Admins Overview"
        subTitle="Welcome back! Check all the Admins"
        items={[{ label: "Users" }, { label: "Admins", active: true }]}
      />
      <Container fluid>
        <Row>
          <AdminList />
        </Row>
      </Container>
    </>
  );
};

export default AdminsContainer;
