import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Advisers from "@/Components/General/Dashboard/CommonComponents/CommonUsers/Advisers/Advisers";
import { Container } from "reactstrap";

const NetworkDirectorAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Registered Advisers"
        subTitle="Welcome to the Registered Advisers"
        parent="Users"
        child="Advisers"
      />
      <Container fluid>
        <Advisers />
      </Container>
    </>
  );
};

export default NetworkDirectorAdvisersContainer;
