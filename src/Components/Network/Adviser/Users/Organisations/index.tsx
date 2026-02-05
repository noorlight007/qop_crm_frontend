import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import OrganisationList from "@/Components/Common/Organisations/OrganisationList/OrganisationList";

const OrganisationsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Organisations"
        subTitle="This is the organisations page"
        parent="Organisations"
      />
      <OrganisationList />
    </div>
  );
};

export default OrganisationsContainer;
