import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "./CaseDetails/CaseDetails";

const CaseDetailsPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Network Case Details"
        subTitle="Welcome! Continue your journey."
        items={[
          { label: "Networks" },
          { label: "Network Case Details", active: true },
        ]}
      />
      <CaseDetails />
    </div>
  );
};

export default CaseDetailsPage;
