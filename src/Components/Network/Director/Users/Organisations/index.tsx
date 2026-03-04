import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OrganisationList from "@/Components/Common/Organisations/OrganisationList/OrganisationList";

const NetworkDirectorOrganisationsContainer = () => {
  return (
    <>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome to the Organisations Status"
        items={[{ label: "Users" }, { label: "Organisations", active: true }]}
      />
      <OrganisationList />
    </>
  );
};

export default NetworkDirectorOrganisationsContainer;
