import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import NetworkList from "./NetworkList/NetworkList";

const AdminNetworksContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Networks Overview"
        subTitle="Welcome back! Check all the Networks"
        items={[{ label: "Networks", active: true }]}
      />
      <Container fluid>
        <Row>
          <NetworkList />
        </Row>
      </Container>
    </>
  );
};

export default AdminNetworksContainer;
