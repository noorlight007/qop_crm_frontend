'use client';
import { useDeleteNetworkCaseMutation } from '@/Redux/Reducers/SuperAdmin/Networks/NetworkCasesApi';
import { useParams } from 'next/navigation';
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

interface DeleteNetworkCaseModalProps {
  isOpen: boolean;
  toggle: () => void;
  caseToDelete: {
    alias: string;
    name: string;
  } | null;
}
const DeleteNetworkCaseModal: React.FC<DeleteNetworkCaseModalProps> = ({
  isOpen,
  toggle,
  caseToDelete,
}) => {
  const { networkslug } = useParams();

  const [deleteNetworkCase, { isLoading: isDeletingCase }] =
    useDeleteNetworkCaseMutation();
  const [confirmText, setConfirmText] = useState('');

  const caseName = caseToDelete?.name ?? '';
  const isConfirmed = caseName !== '' && confirmText.trim() === caseName;

  // reset confirmation input whenever the modal opens/closes
  useEffect(() => {
    setConfirmText('');
  }, [isOpen]);

  const getErrorMessage = (error: any) => {
    const data = error?.data || error?.error?.data || error;

    if (typeof data?.detail === 'string') return data.detail;
    if (typeof data?.message === 'string') return data.message;

    if (data && typeof data === 'object') {
      const firstField = Object.values(data)[0];
      if (Array.isArray(firstField) && firstField.length > 0) {
        return String(firstField[0]);
      }
      if (typeof firstField === 'string') {
        return firstField;
      }
    }

    return 'Failed to delete case. Please try again.';
  };

  const handleDeleteCase = async () => {
    if (!isConfirmed) return;
    if (!networkslug || !caseToDelete?.alias) {
      toast.error('Missing case information.');
      return;
    }

    try {
      await deleteNetworkCase({
        network_slug: networkslug,
        case_alias: caseToDelete.alias,
      }).unwrap();
      toast.success('Case deleted successfully.');
      toggle();
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className='text-danger'>Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Are you sure you want to delete the case{' '}
          <strong className='text-danger'>{caseName}</strong>?
        </p>

        <div className='border border-danger rounded p-3 bg-light'>
          <p className='mb-2 fw-semibold text-danger'>
            This action is irreversible.
          </p>
          <small className='text-muted'>
            Deleting this case will permanently remove all associated data,
            including applicant details, notes, documents, portfolio, tasks,
            and all historical records. This data cannot be restored.
          </small>
        </div>

        <div className='mt-3'>
          <Label for='confirm-network-case-name' className='mb-1'>
            Type <strong className='text-danger'>{caseName}</strong> to confirm
          </Label>
          <Input
            id='confirm-network-case-name'
            type='text'
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isConfirmed && !isDeletingCase)
                handleDeleteCase();
            }}
            placeholder={caseName}
            autoComplete='off'
            disabled={isDeletingCase}
            invalid={confirmText !== '' && !isConfirmed}
            valid={isConfirmed}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggle} disabled={isDeletingCase}>
          Cancel
        </Button>
        <Button
          color='danger'
          onClick={handleDeleteCase}
          disabled={isDeletingCase || !isConfirmed}
        >
          {isDeletingCase ? 'Deleting...' : 'Delete'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteNetworkCaseModal;
