import React from "react";
import { AlertTriangle } from "react-feather";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface Task {
  id: string;
  date: string;
  caseNumber: string;
  clientName: string;
  company: string;
  taskName: string;
  priority: "Low" | "Normal" | "High";
  status: "Pending" | "Completed" | "Overdue";
  assignedTo: string;
  taskType: string;
  dueDate: string;
}

interface DeleteTaskModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  selectedTask: Task | null;
  handleDeleteTask: (taskId: string) => void;
}

const DeleteTaskModal: React.FC<DeleteTaskModalProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedTask,
  handleDeleteTask,
}) => {
  const confirmDelete = () => {
    if (selectedTask) {
      handleDeleteTask(selectedTask.id);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isDeleteModalOpen}
      toggle={() => setIsDeleteModalOpen(false)}
      centered
    >
      <ModalHeader toggle={() => setIsDeleteModalOpen(false)}>
        <div className="d-flex align-items-center">
          <AlertTriangle className="text-danger me-2" size={20} />
          Confirm Delete
        </div>
      </ModalHeader>
      <ModalBody>
        {selectedTask && (
          <div>
            <p className="mb-3">
              Are you sure you want to delete the following task?
            </p>
            <div className="bg-light-dark p-3 rounded">
              <h6 className="mb-2 text-primary">{selectedTask.taskName}</h6>
              <p className="mb-1">
                <strong>Client:</strong> {selectedTask.clientName}
              </p>
              <p className="mb-1">
                <strong>Company:</strong> {selectedTask.company}
              </p>
              <p className="mb-1">
                <strong>Case Number:</strong> {selectedTask.caseNumber}
              </p>
              <p className="mb-0">
                <strong>Assigned To:</strong> {selectedTask.assignedTo}
              </p>
            </div>
            <div className="mt-3">
              <small className="text-muted">
                This action cannot be undone.
              </small>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setIsDeleteModalOpen(false)}>
          Cancel
        </Button>
        <Button color="danger" onClick={confirmDelete}>
          Delete Task
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteTaskModal;
