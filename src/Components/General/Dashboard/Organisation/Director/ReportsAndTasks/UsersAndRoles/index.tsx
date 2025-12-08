import { Container } from "reactstrap";
import Breadcrumbs from "../../../CommonComponents/Breadcrumbs/Breadcrumbs";
import UsersAndRolesOverview from "./UsersAndRolesOverview/UsersAndRolesOverview";
import UsersAndRolesTabs from "./UsersAndRolesTabs/UsersAndRolesTabs";

const UsersAndRolesContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Users & Roles"
        subTitle="Manage user access, roles, and permissions"
        parent="Reports & Tasks"
        child="Users & Roles"
      />
      <Container fluid>
        <UsersAndRolesOverview />
        <UsersAndRolesTabs />
      </Container>
    </>
  );
};

export default UsersAndRolesContainer;
