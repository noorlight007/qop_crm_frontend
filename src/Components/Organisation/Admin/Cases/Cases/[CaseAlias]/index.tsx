import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationAdminCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage Case"
        items={[
          { label: "Cases" },
          { label: "All Cases" },
          { label: "Case Details", active: true },
        ]}
      />
      <CaseDetails />
    </>
  );
};

export default OrganisationAdminCaseDetailsContainer;
