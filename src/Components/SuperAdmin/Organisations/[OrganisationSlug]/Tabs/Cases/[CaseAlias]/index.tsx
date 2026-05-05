import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Organisations/OrganisationDetails/Tabs/Cases/CaseDetails/CaseDetails";

const CaseDetailsPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Organisation Case Details"
        subTitle="Welcome! Continue your journey."
        items={[
          { label: "Organisations" },
          { label: "Organisation Case Details", active: true },
        ]}
      />
      <CaseDetails />
    </div>
  );
};

export default CaseDetailsPage;
