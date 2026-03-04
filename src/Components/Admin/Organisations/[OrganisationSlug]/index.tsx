"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import OrganisationDetails from "./OrganisationDetails/OrganisationDetails";

const OrganisationDetailsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome! Continue your journey."
        items={[{ label: "Organisations", active: true }]}
      />
      <Container fluid>
        <OrganisationDetails />
      </Container>
    </div>
  );
};

export default OrganisationDetailsContainer;
