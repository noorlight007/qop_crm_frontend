import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import SingleCaseInfo from "@/Components/Common/Cases/CaseDetails/SingleCaseInfo";

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
