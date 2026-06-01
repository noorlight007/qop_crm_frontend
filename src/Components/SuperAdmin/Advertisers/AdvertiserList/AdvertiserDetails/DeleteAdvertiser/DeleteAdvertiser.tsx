import { DeleteAdvertiserProps } from '@/Types/SuperAdmin/Advertisers/AdvertisersTypes';
import { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from 'reactstrap';
import DeleteAdvertiserModal from '../Modals/DeleteAdvertiserModal';

const DeleteAdvertiser: React.FC<DeleteAdvertiserProps> = ({
  advertiserData,
  isLoading,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);

  const irreversibleLossItems = [
    'Advertiser profile and contact details',
    'Any linked advertiser configuration and references',
    'Historical records tied to this advertiser',
  ];

  return (
    <div>
      <Row>
        <Col xs='12'>
          <Card
            className='shadow-lg border-danger'
            style={{ borderLeft: '4px solid #dc3545' }}
          >
            <CardHeader className='bg-danger bg-opacity-10 border-bottom border-danger'>
              <div className='d-flex align-items-center gap-2'>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                <h4 className='mb-0 fw-bold'>Danger Zone</h4>
              </div>
            </CardHeader>
            <CardBody className='p-4'>
              <div className='d-flex flex-column flex-lg-row justify-content-between gap-4'>
                <div>
                  <h5 className='fw-bold mb-2 text-dark'>
                    Delete this Advertiser
                  </h5>
                  <p className='mb-3 text-muted'>
                    This action is permanent and cannot be undone. Please be
                    absolutely certain before proceeding.
                  </p>
                </div>
                <div>
                  <Button
                    color='danger'
                    onClick={toggleDeleteModal}
                    className='fw-semibold px-4 py-2 text-white'
                    disabled={isLoading || !advertiserData?.alias}
                    style={{
                      whiteSpace: 'nowrap',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(220, 53, 69, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Delete this Advertiser Permanently
                  </Button>
                </div>
              </div>
              <Alert
                className='mb-0 border-1 rounded-3 bg-light-danger border-danger'
                role='alert'
              >
                <div className='fw-bold text-danger mb-2'>
                  Before you delete:
                </div>
                <ul className='mb-0 ps-3'>
                  {irreversibleLossItems.map((item) => (
                    <li
                      key={item}
                      className='mb-1 text-muted d-flex align-items-start gap-2'
                    >
                      <i
                        className='fa fa-exclamation-circle text-danger mt-1'
                        aria-hidden='true'
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Alert>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <DeleteAdvertiserModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        advertiserData={advertiserData}
      />
    </div>
  );
};

export default DeleteAdvertiser;
