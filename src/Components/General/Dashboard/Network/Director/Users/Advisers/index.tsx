import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import Advisers from "../../../CommonComponents/Directors/Advisers/Advisers";

const AdvisersContainer: React.FC = () => {
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

export default AdvisersContainer;
