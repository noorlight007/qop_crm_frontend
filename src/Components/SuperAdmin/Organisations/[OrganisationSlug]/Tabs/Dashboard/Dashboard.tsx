import OrganisationDelete from "./OrganisationDelete/OrganisationDelete";
import OrganisationDetails from "./OrganisationDetails/OrganisationDetails";

const Dashboard: React.FC = () => {
  return (
    <div>
      <OrganisationDetails />
      <OrganisationDelete />
    </div>
  );
};

export default Dashboard;