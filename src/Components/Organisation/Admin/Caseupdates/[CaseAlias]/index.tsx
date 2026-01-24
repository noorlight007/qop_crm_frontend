import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SingleCaseInfo from "@/Components/General/Dashboard/CommonComponents/SingleCaseInfo/SingleCaseInfo";

const OrganisationAdminCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage Case"
        parent="Case Updates"
        child="Case"
      />
      <SingleCaseInfo />
    </>
  );
};

export default OrganisationAdminCaseDetailsContainer;
