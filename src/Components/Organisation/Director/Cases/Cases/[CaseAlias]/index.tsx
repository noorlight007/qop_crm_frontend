import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SingleCaseInfo from "@/Components/General/Dashboard/CommonComponents/SingleCaseInfo/SingleCaseInfo";

const OrganisationDirectorCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Case Status"
        subTitle="Hello there!"
        parent="Cases"
        child="Case"
      />
      <SingleCaseInfo />
    </>
  );
};

export default OrganisationDirectorCaseDetailsContainer;
