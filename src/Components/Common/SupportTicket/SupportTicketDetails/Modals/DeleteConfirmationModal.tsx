import { FaSpinner } from 'react-icons/fa';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title = 'Delete Item',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalHeader toggle={onCancel}>{title}</ModalHeader>
      <ModalBody>{message}</ModalBody>
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
