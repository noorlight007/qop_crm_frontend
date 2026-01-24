import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationAdviserCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage case status"
        parent="Cases"
        child="Case"
      />
      <CaseDetails />
    </>
  );
};

export default OrganisationAdviserCaseDetailsContainer;
