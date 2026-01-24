import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationAdminCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage Case"
        parent="Case Updates"
        child="Case"
      />
      <CaseDetails />
    </>
  );
};

export default OrganisationAdminCaseDetailsContainer;
