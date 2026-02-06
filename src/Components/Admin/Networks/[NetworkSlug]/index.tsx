"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import NetworkDetailsTab from "./NetworkDetails/NetworkDetails";

const NetworkDetails: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Network Status"
        subTitle="Welcome! Continue your journey."
        parent="Networks"
      />
      <Container fluid>
        <NetworkDetailsTab />
      </Container>
    </div>
  );
};

export default NetworkDetails;
