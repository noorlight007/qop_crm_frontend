import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OrganisationDetails from "@/Components/Common/Organisations/OrganisationDetails/OrganisationDetails";

const NetworkDirectorSingleOrganisationContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome! Continue your journey."
        parent="Users"
        child="Organisation"
      />
      <OrganisationDetails />
    </>
  );
};

export default NetworkDirectorSingleOrganisationContainer;
