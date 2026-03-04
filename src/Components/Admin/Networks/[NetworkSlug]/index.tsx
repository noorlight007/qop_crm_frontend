"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import NetworkDetails from "./NetworkDetails/NetworkDetails";

const NetworkDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Network Status"
        subTitle="Welcome! Continue your journey."
        items={[{ label: "Networks", active: true }]}
      />
      <Container fluid>
        <NetworkDetails />
      </Container>
    </div>
  );
};

export default NetworkDetailsContainer;
