import { FaSpinner } from 'react-icons/fa';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item?',
  description = 'This item will be permanently removed. This data cannot be restored.',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>
        <h3 className='text-danger'>{title}</h3>
      </ModalHeader>
      <ModalBody>
        <p>{message}</p>

        <div className='border border-danger rounded p-3 bg-light'>
          <p className='mb-2 fw-semibold text-danger'>
            This action is irreversible.
          </p>
          <small className='text-muted'>{description}</small>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button color='danger' onClick={onConfirm} disabled={isLoading}>
          {isLoading ? <FaSpinner className='fa-spin me-1' /> : null}
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteConfirmationModal;
