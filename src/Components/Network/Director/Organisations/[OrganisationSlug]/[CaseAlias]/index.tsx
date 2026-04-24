import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import CaseDetails from "@/Components/Common/Organisations/OrganisationDetails/Cases/CaseDetails/CaseDetails";

const OrgCaseDetails: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        title="Organisation Case Details"
        subTitle="Welcome! Continue your journey."
        items={[
          { label: "Organisations" },
          { label: "Organisation Details" },
          { label: "Case Details", active: true },
        ]}
      />
      <CaseDetails />
    </div>
  );
};

export default OrgCaseDetails;
