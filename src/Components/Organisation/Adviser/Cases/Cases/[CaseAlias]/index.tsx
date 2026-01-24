import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SingleCaseInfo from "@/Components/General/Dashboard/CommonComponents/SingleCaseInfo/SingleCaseInfo";

const OrganisationAdviserCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Manage case status"
        parent="Cases"
        child="Case"
      />
      <SingleCaseInfo />
    </>
  );
};

export default OrganisationAdviserCaseDetailsContainer;
