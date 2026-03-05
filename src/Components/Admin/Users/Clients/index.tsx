import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container, Row } from "reactstrap";
import ClientList from "./ClientList/ClientList";

const ClientsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Clients Overview"
        subTitle="Welcome back! Check all the Clients"
        items={[{ label: "Users" }, { label: "Clients", active: true }]}
      />
      <Container fluid>
        <Row>
          <ClientList />
        </Row>
      </Container>
    </>
  );
};

export default ClientsContainer;
