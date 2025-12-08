import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import { Container } from "reactstrap";
import UsersAndRolesOverview from "./UsersAndRolesOverview/UsersAndRolesOverview";
import UsersAndRolesTabs from "./UsersAndRolesTabs/UsersAndRolesTabs";

const OrganisationDirectorUsersAndRolesContainer: React.FC = () => {
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

export default OrganisationDirectorUsersAndRolesContainer;
