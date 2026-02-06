"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import OrganisationDetailsTab from "./OrganisationDetails/OrganisationDetails";

const OrganisationDetails: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome! Continue your journey."
        parent="Organisations"
      />
      <Container fluid>
        <OrganisationDetailsTab />
      </Container>
    </div>
  );
};

export default OrganisationDetails;
