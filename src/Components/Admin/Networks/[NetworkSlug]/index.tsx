"use client";
import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import { useGetNetworkDetailsQuery } from "@/Redux/Reducers/Admin/Networks/NetworksApi";
import { useParams } from "next/navigation";
import { Container } from "reactstrap";

const NetworkDetails: React.FC = () => {
  // useParams is a client hook — this file must be a client component ("use client")
  const params = useParams() as Record<string, string | undefined> | null;
  // Normalise common segment name variants: `networkslug`, `networkSlug`, `NetworkSlug`, or `slug`
  const slug =
    params?.networkslug ??
    params?.networkSlug ??
    params?.NetworkSlug ??
    params?.slug;

  console.log("Network Slug: ", slug);

  const { data: getNetworkDetails, isLoading } = useGetNetworkDetailsQuery(
    { network_slug: slug || "" },
    {
      skip: !slug,
    },
  );

  console.log("Network Details Data: ", getNetworkDetails);

  return (
    <div>
      <Breadcrumbs
        title="Network Status"
        subTitle="Welcome! Continue your journey."
        parent="Networks"
      />
      <Container fluid>
        <h1>Network Details Page</h1>
        <p>Network Slug: {slug}</p>
      </Container>
    </div>
  );
};

export default NetworkDetails;
