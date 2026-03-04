import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Cases/CaseDetails/CaseDetails";

const NetworkDirectorCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Network Case Status"
        subTitle="Hello there!"
        items={[{ label: "Cases" }, { label: "Case", active: true }]}
      />
      <CaseDetails />
    </>
  );
};

export default NetworkDirectorCaseDetailsContainer;
