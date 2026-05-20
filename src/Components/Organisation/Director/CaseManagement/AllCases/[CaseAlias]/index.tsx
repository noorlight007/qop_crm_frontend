import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const OrganisationDirectorCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Overview"
        subTitle="Here you can see the details of the case"
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
