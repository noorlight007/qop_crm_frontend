import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationAdminCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage Case"
        items={[{ label: "Case Updates" }, { label: "Case", active: true }]}
      />
      <CaseDetails />
    </>
  );
};

export default OrganisationAdminCaseDetailsContainer;
