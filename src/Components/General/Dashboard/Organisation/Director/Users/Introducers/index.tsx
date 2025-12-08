import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Introducers from "@/Components/General/Dashboard/CommonComponents/Directors/Introducers/Introducers";
import { Container } from "reactstrap";

const OrganisationDirectorIntroducersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Introducer Status"
        subTitle="Manage organisation introducers"
        parent="Users"
        child="Introducers"
      />
      <Container fluid>
        <Introducers />
      </Container>
    </>
  );
};

export default OrganisationDirectorIntroducersContainer;
