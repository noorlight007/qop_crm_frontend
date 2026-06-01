import { useGetNetworkDetailsQuery } from '@/Redux/Reducers/SuperAdmin/Networks/NetworksApi';
import { useParams } from 'next/navigation';
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
import DeleteNetworkModal from '../Modals/DeleteNetworkModal';

const NetworkDelete: React.FC = () => {
  const params = useParams();
  const slug = params?.networkslug;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { data: getNetworkDetails } = useGetNetworkDetailsQuery({
    network_slug: slug,
  });
  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };
  const irreversibleLossItems = [
    'Organisation profile and core settings',
    'Linked users, roles, and permissions',
    'Leads, introducers, and related activity history',
    'Case links, workflow mapping, and internal notes',
    'Audit references tied to this organisation',
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
                    Delete this Network
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
                    Delete this Network Permanently
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
      <DeleteNetworkModal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        networkInfo={getNetworkDetails}
      />
    </div>
  );
};

export default NetworkDelete;
