import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import Advisers from "@/Components/General/Dashboard/CommonComponents/Directors/Advisers/Advisers";
import { Container } from "reactstrap";

const NetworkDirectorAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Registered Advisers Status"
        subTitle="Welcome to the Registered Advisers Status"
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
