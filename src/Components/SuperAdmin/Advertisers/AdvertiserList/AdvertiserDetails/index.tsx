import Breadcrumbs from "@/Components/Common/Breadcrumbs/Breadcrumbs";
import {
  useGetAdvertiserAdsQuery,
  useGetAdvertiserDetailsQuery,
} from "@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import AdvertiserAds from "./AdvertiserAds/AdvertiserAds";
import AdvertisersInfo from "./AdvertisersInfo/AdvertisersInfo";
import DeleteAdvertiser from "./DeleteAdvertiser/DeleteAdvertiser";

const AdvertiserDetailsContainer: React.FC = () => {
  const { advertiseralias } = useParams();
  const [adsPage, setAdsPage] = useState(1);
  const adsPageSize = 12;

  useEffect(() => {
    setAdsPage(1);
  }, [advertiseralias]);

  const { data: advertiserData, isLoading } = useGetAdvertiserDetailsQuery({
    alias: advertiseralias,
  });
  const { data: advertiserAdsData, isLoading: advertiserAdsLoading } =
    useGetAdvertiserAdsQuery({
      alias: advertiseralias,
      page: adsPage,
      page_size: adsPageSize,
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
          currentPage={adsPage}
          pageSize={adsPageSize}
          onPageChange={setAdsPage}
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
