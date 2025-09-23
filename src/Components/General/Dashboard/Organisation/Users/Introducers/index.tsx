import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Introducers from "../../../CommonComponents/Directors/Introducers/Introducers";

const OrganisationIntroducersContainer: React.FC = () => {
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

export default OrganisationIntroducersContainer;
