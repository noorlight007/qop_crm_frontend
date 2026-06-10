import Breadcrumbs from '@/Components/Common/Breadcrumbs/Breadcrumbs';
import {
  useGetAdvertiserAdsQuery,
  useGetAdvertiserDetailsQuery,
} from '@/Redux/Reducers/SuperAdmin/Advertisers/AdvertisersApi';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import AdvertiserAds from './AdvertiserAds/AdvertiserAds';
import AdvertisersInfo from './AdvertisersInfo/AdvertisersInfo';
import DeleteAdvertiser from './DeleteAdvertiser/DeleteAdvertiser';

const AdvertiserDetailsContainer: React.FC = () => {
  const { advertiseralias } = useParams();
  const advertiserAlias = Array.isArray(advertiseralias)
    ? advertiseralias[0]
    : advertiseralias;
  const [adsPage, setAdsPage] = useState(1);
  const adsPageSize = 12;

  useEffect(() => {
    setAdsPage(1);
  }, [advertiserAlias]);

  const { data: advertiserData, isLoading } = useGetAdvertiserDetailsQuery({
    alias: advertiserAlias,
  });
  const { data: advertiserAdsData, isLoading: advertiserAdsLoading } =
    useGetAdvertiserAdsQuery({
      alias: advertiserAlias,
      page: adsPage,
      page_size: adsPageSize,
    });

  return (
    <div>
      <Breadcrumbs
        title='Advertiser Details'
        subTitle='Manage your advertiser details and information here.'
        items={[
          { label: 'Advertisers' },
          { label: 'Advertiser Details', href: '#', active: true },
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
          advertiserAlias={String(advertiserAlias || '')}
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
