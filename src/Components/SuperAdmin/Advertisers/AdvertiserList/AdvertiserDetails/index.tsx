import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import {
  useGetAdvertiserAdsQuery,
  useGetAdvertiserDetailsQuery,
} from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import { useParams } from "next/navigation";
import { Container } from "reactstrap";
import AdvertiserAds from "./AdvertiserAds/AdvertiserAds";
import AdvertisersInfo from "./AdvertisersInfo/AdvertisersInfo";
import DeleteAdvertiser from "./DeleteAdvertiser/DeleteAdvertiser";

const AdvertiserDetailsContainer: React.FC = () => {
  const { advertiseralias } = useParams();
  const { data: advertiserData, isLoading } = useGetAdvertiserDetailsQuery({
    alias: advertiseralias,
  });
  const { data: advertiserAdsData, isLoading: advertiserAdsLoading } =
    useGetAdvertiserAdsQuery({
      alias: advertiseralias,
    });

  return (
    <div>
      <Breadcrumbs
        title="Advertiser Details"
        subTitle="Manage your advertiser details and information here."
        items={[
          { label: "Advertisers", href: "/super-admin/advertisers" },
          { label: "Advertiser Details", href: "#", active: true },
        ]}
      />
      <Container fluid>
        <AdvertisersInfo
          advertiserData={advertiserData}
          isLoading={isLoading}
        />
        <AdvertiserAds
          advertiserAdsData={advertiserAdsData}
          advertiserAdsLoading={advertiserAdsLoading}
        />
        <DeleteAdvertiser
          advertiserData={advertiserData}
          isLoading={isLoading}
        />
      </Container>
    </div>
  );
};

export default AdvertiserDetailsContainer;
