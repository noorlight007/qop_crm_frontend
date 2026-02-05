"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { useGetNetworkDetailsQuery } from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { useParams } from "next/navigation";
import { Container } from "reactstrap";
import NetworkDetailsTab from "./NetworkDetails/NetworkDetails";

const NetworkDetails: React.FC = () => {
  const params = useParams() as Record<string, string | undefined> | null;
  const slug = params?.networkslug;

  const { data: getNetworkDetails, isLoading } = useGetNetworkDetailsQuery(
    { network_slug: slug || "" },
    {
      skip: !slug,
    },
  );

  return (
    <div>
      <Breadcrumbs
        title="Network Status"
        subTitle="Welcome! Continue your journey."
        parent="Networks"
      />
      <Container fluid>
        <NetworkDetailsTab
          slug={slug}
          networkData={getNetworkDetails}
          isLoading={isLoading}
        />
      </Container>
    </div>
  );
};

export default NetworkDetails;
