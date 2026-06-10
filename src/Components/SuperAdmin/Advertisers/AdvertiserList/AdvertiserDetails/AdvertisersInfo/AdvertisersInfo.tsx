import LoadingGrow from '@/CommonComponent/LoadingGrow/LoadingGrow';
import { AdvertisersInfoProps } from '@/Types/SuperAdmin/Advertisers/AdvertisersTypes';
import { useState } from 'react';
import { Edit } from 'react-feather';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import EditAdvertiserModal from '../Modals/EditAdvertiserModal';

const AdvertisersInfo: React.FC<AdvertisersInfoProps> = ({
  advertiserData,
  isLoading,
}) => {
  const website = advertiserData?.website?.trim() || '';
  const email = advertiserData?.contact_email?.trim() || '';

  const [isEditOpen, setIsEditOpen] = useState(false);
  const toggleEditModal = () => setIsEditOpen((prev) => !prev);

  return (
    <>
      <Card>
        <CardHeader className='d-flex align-items-center justify-content-between'>
          <h4 className='card-title mb-0'>Advertiser Info</h4>
          <Button
            color='primary'
            size='sm'
            onClick={toggleEditModal}
            disabled={isLoading || !advertiserData}
          >
            <Edit size={16} className='me-1' />
            Edit
          </Button>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className='text-center py-5'>
              <LoadingGrow />
            </div>
          ) : advertiserData ? (
            <Row className='gx-4 gy-3'>
              <Col md='4'>
                <div>
                  <h6 className='mb-1 text-muted '>Company Name</h6>
                  <p className='mb-0 text-uppercase fw-medium'>
                    {advertiserData.company_name || (
                      <small className='text-muted'>Not provided</small>
                    )}
                  </p>
                </div>
              </Col>
              <Col md='4'>
                <div>
                  <h6 className='mb-1 text-muted'>Contact Email</h6>
                  <p className='mb-0 fw-medium'>
                    {email ? (
                      <span className='text-muted'>{email}</span>
                    ) : (
                      <small className='text-muted'>Not provided</small>
                    )}
                  </p>
                </div>
              </Col>
              <Col md='4'>
                <div>
                  <h6 className='mb-1 text-muted'>Website</h6>
                  <p className='mb-0 fw-medium'>
                    {website ? (
                      <a
                        href={website}
                        target='_blank'
                        rel='noreferrer'
                        className='text-muted text_decoration_hover'
                      >
                        {website}
                      </a>
                    ) : (
                      <small className='text-muted'>Not provided</small>
                    )}
                  </p>
                </div>
              </Col>
            </Row>
          ) : (
            <p className='text-center text-muted mb-0'>
              No advertiser information available.
            </p>
          )}
        </CardBody>
      </Card>

      <EditAdvertiserModal
        isOpen={isEditOpen}
        toggleModal={toggleEditModal}
        advertiserData={advertiserData}
      />
    </>
  );
};

export default AdvertisersInfo;
