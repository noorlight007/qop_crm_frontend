import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationDirectorCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Hello there!"
        parent="Cases"
        child="Case"
      />
      <CaseDetails />
    </>
  );
};

export default OrganisationDirectorCaseDetailsContainer;
