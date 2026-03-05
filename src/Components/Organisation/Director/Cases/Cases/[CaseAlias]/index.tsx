import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationDirectorCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Hello there!"
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

export default OrganisationDirectorCaseDetailsContainer;
