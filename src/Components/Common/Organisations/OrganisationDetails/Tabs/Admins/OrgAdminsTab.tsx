"use client";
import OrgUserList from "@/Components/Common/Organisations/OrganisationDetails/Tabs/Common/OrgUserList/OrgUserList";

const OrgAdminsTab: React.FC = () => {
  return <OrgUserList role="ADMIN" />;
};

export default OrgAdminsTab;
