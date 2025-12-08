import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import OrganisationList from "./OrganisationList/OrganisationList";
import "./Organisations.css";

const OrganisationsContainer = () => {
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

export default OrganisationsContainer;
