import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OrganisationDetails from "@/Components/Common/Organisations/OrganisationDetails/OrganisationDetails";

const NetworkDirectorSingleOrganisationContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Organisation Status"
        subTitle="Welcome! Continue your journey."
        items={[{ label: "Users" }, { label: "Organisation", active: true }]}
      />
      <OrganisationDetails />
    </>
  );
};

export default NetworkDirectorSingleOrganisationContainer;
