import { useDeleteOrganisationMutation } from '@/Redux/Reducers/Common/Organisations/OrganisationDetails/SingleOrganisationApi';
import { DeleteOrganisationModalProps } from '@/Types/Common/Organisations/OrganisationsTypes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import {
  Button,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

const DeleteOrganisationModal: React.FC<DeleteOrganisationModalProps> = ({
  isOpen,
  toggle,
  organisationInfo,
}) => {
  const router = useRouter();
  // rtk hooks
  const [deleteOrganisation, { isLoading }] = useDeleteOrganisationMutation();
  const [confirmText, setConfirmText] = useState('');

  const organisationName = organisationInfo?.organization?.name ?? '';
  const isConfirmed =
    organisationName !== '' && confirmText.trim() === organisationName;

  // reset confirmation input whenever the modal opens/closes
  useEffect(() => {
    setConfirmText('');
  }, [isOpen]);

  const handleDelete = async () => {
    if (!isConfirmed) return;
    try {
      const slug = organisationInfo?.organization?.slug;
      const response = await deleteOrganisation({ slug });
      toggle();
      if (response.data === null) {
        toast.success('Organisation deleted successfully!');
      } else {
        toast.error('Failed to delete organisation.');
      }
      router.back();
    } catch (error) {
      console.error('Failed to delete organisation', error);
      toast.error('Failed to delete organisation. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className='text-danger'>Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete{' '}
          <strong className='text-danger'>
            {organisationInfo?.organization?.name}
          </strong>{' '}
          organisation?
        </p>

        <div className='border border-danger rounded p-3 bg-light'>
          <p className='mb-2 fw-semibold text-danger'>
            This action is irreversible.
          </p>
          <small className='text-muted'>
            Deleting this organisation will permanently remove all associated
            data, including cases, leads, clients, advisers, admins, joint
            applicants, appearance preferences, settings, profile information,
            and all historical records. This data cannot be restored.
          </small>
        </div>

        <div className='mt-3'>
          <Label for='confirm-organisation-name' className='mb-1'>
            Type <strong className='text-danger'>{organisationName}</strong> to
            confirm
          </Label>
          <Input
            id='confirm-organisation-name'
            type='text'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isConfirmed && !isLoading)
                handleDelete();
            }}
            placeholder={organisationName}
            autoComplete='off'
            disabled={isLoading}
            invalid={confirmText !== '' && !isConfirmed}
            valid={isConfirmed}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggle} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          color='danger'
          onClick={handleDelete}
          disabled={isLoading || !isConfirmed}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteOrganisationModal;
