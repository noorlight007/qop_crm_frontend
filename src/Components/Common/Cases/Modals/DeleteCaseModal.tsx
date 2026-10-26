import { useDeleteCaseMutation } from '@/Redux/Reducers/Common/Cases/CasesApi';
import { DeleteCaseModalProps } from '@/Types/Common/Cases/CaseTypes';
import React, { useEffect, useState } from 'react';
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

const DeleteCaseModal: React.FC<DeleteCaseModalProps> = ({
  isOpen,
  toggle,
  caseData,
  onDelete,
}) => {
  const [deleteCaseDetails, { isLoading: isDeleting }] =
    useDeleteCaseMutation();
  const [confirmText, setConfirmText] = useState('');

  const caseName = caseData?.name ?? '';
  const isConfirmed = caseName !== '' && confirmText.trim() === caseName;

  // reset confirmation input whenever the modal opens/closes
  useEffect(() => {
    setConfirmText('');
  }, [isOpen]);

  const handleCaseDeletion = async (caseAlias: string) => {
    if (!isConfirmed) return;
    try {
      await deleteCaseDetails({ caseAlias }).unwrap();
      toast.success('Case deleted successfully.');
      onDelete();
    } catch (error) {
      console.error('Error deleting case:', error);
      toast.error('Failed to delete case. Please try again.');
    }
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <h3 className='text-danger'>Confirm Deletion</h3>
      </ModalHeader>
      <ModalBody>
        {caseData ? (
          <>
            <p>
              Are you sure you want to delete the case{' '}
              <strong className='text-danger'>{caseName}</strong>?
            </p>

            <div className='border border-danger rounded p-3 bg-light'>
              <p className='mb-2 fw-semibold text-danger'>
                This action is irreversible.
              </p>
              <small className='text-muted'>
                Deleting this case will permanently remove all associated
                data, including applicant details, notes, documents, portfolio,
                tasks, and all historical records. This data cannot be
                restored.
              </small>
            </div>

            <div className='mt-3'>
              <Label for='confirm-case-name' className='mb-1'>
                Type <strong className='text-danger'>{caseName}</strong> to
                confirm
              </Label>
              <Input
                id='confirm-case-name'
                type='text'
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isConfirmed && !isDeleting)
                    handleCaseDeletion(caseData.alias);
                }}
                placeholder={caseName}
                autoComplete='off'
                disabled={isDeleting}
                invalid={confirmText !== '' && !isConfirmed}
                valid={isConfirmed}
              />
            </div>
          </>
        ) : (
          <p>No case selected for deletion.</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggle} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          color='danger'
          onClick={() => caseData && handleCaseDeletion(caseData.alias)}
          disabled={isDeleting || !isConfirmed}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteCaseModal;
