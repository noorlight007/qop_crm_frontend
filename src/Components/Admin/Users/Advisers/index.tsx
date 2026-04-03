import AuthUsers from "@/Components/Admin/CommonUsers/AuthUsers/AuthUsers";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";

const AdminAdvisersContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Advisers Overview"
        subTitle="Welcome back! Check all the Advisers"
        items={[{ label: "Users" }, { label: "Advisers", active: true }]}
      />
      <Container fluid>
        <AuthUsers title="Adviser" roles={"ADVISER"} />
      </Container>
    </>
  );
};

export default AdminAdvisersContainer;
