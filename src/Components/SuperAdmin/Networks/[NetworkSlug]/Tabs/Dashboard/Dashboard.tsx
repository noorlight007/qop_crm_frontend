import NetworkDelete from "./NetworkDelete/NetworkDelete";
import NetworkDetails from "./NetworkDetails/NetworkDetails";

const Dashboard: React.FC = () => {
  return (
    <div>
      <NetworkDetails />
      <NetworkDelete />
    </div>
  );
};

export default Dashboard;
