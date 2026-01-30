import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import NetworkList from "./NetworkList/NetworkList";

const AdminNetworksContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Networks Overview"
        subTitle="Welcome back! Check all the Networks"
        parent="Networks"
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
