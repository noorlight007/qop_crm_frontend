import { useGetNetworkDetailsQuery } from "@/Redux/Reducers/SuperAdmin/Networks/NetworksApi";
import { useParams } from "next/navigation";
import Address from "./Address/Address";
import NetworkDelete from "./NetworkDelete/NetworkDelete";
import NetworkDetails from "./NetworkDetails/NetworkDetails";

const Dashboard: React.FC = () => {
  const params = useParams();
  const slug = params?.networkslug;
  const { data: getNetworkDetails, isLoading } = useGetNetworkDetailsQuery({
    network_slug: slug,
  });

  return (
    <div>
      <NetworkDetails
        networkData={getNetworkDetails}
        isLoading={isLoading}
        slug={slug as string}
      />
      <Address
        networkData={getNetworkDetails}
        isLoading={isLoading}
        slug={slug as string}
      />
      <NetworkDelete />
    </div>
  );
};

export default Dashboard;
