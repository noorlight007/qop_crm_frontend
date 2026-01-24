import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const NetworkDirectorCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Network Case Status"
        subTitle="Hello there!"
        parent="Cases"
        child="Case"
      />
      <CaseDetails />
    </>
  );
};

export default NetworkDirectorCaseDetailsContainer;
