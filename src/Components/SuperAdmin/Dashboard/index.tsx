import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Col, Container, Row } from "reactstrap";
import Overview from "./Overview/Overview";

const AdminDashboardContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Admin Dashboard(Under development)"
        subTitle="Manage your admin dashboard"
        items={[
          { label: "Home" },
          { label: "Admin Dashboard", href: "/admin/dashboard", active: true },
        ]}
      />
      {/* Other dashboard components can be added here */}
      <Container fluid>
        <Row>
          <Col sm="12">
            <Overview />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboardContainer;
