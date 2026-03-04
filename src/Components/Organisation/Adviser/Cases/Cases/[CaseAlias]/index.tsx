import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationAdviserCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage case status"
        items={[{ label: "Cases" }, { label: "Case", active: true }]}
      />
      <CaseDetails />
    </>
  );
};

export default OrganisationAdviserCaseDetailsContainer;
