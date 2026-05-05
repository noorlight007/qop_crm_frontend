"use client";
import OrgUserList from "@/Components/Common/Organisations/OrganisationDetails/Tabs/Common/OrgUserList";

const OrgAdmins: React.FC = () => {
  return <OrgUserList role="ADMIN" />;
};

export default OrgAdmins;
