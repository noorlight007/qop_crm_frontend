import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OrganisationList from "./OrganisationList/OrganisationList";

const NetworkDirectorOrganisationsContainer = () => {
  return (
    <>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome to the Organisations Status"
        parent="Users"
        child="Organisations"
      />
      <OrganisationList />
    </>
  );
};

export default NetworkDirectorOrganisationsContainer;
