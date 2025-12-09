import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import SingleCaseInfo from "@/Components/General/Dashboard/CommonComponents/SingleCaseInfo/SingleCaseInfo";

const CaseContainer: React.FC = () => {
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

export default CaseContainer;
