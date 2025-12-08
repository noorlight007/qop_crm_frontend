import Breadcrumbs from "@/Components/General/Dashboard/CommonComponents/Breadcrumbs/Breadcrumbs";
import SingleCaseInfo from "@/Components/General/Dashboard/CommonComponents/SingleCaseInfo/SingleCaseInfo";

const NetworkDirectorCaseDetailsContainer: React.FC = () => {
  return (
    <>
      <Breadcrumbs
        title="Network Case Status"
        subTitle="Hello there!"
        parent="Cases"
        child="Case"
      />
      <SingleCaseInfo />
    </>
  );
};

export default NetworkDirectorCaseDetailsContainer;
