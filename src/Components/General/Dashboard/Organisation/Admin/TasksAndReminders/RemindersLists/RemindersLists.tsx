import { FC, useState } from 'react';
import { TbBell, TbCalendarTime, TbCheck, TbX } from 'react-icons/tb';
import { Card, Badge, Modal, ModalHeader, ModalBody, Row, Col } from 'reactstrap';

interface Reminder {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  client?: string;
  dueDate: string;
  createdBy: string;
  createdDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Snoozed' | 'Active' | 'Overdue';
  type: 'Email' | 'In-App' | 'Both' | 'Recurring';
}

const reminders: Reminder[] = [
  {
    id: '1',
    title: 'Quarterly compliance review',
    description: 'Review all active cases for compliance requirements',
    assignedTo: 'All Advisers',
    dueDate: '1/18/2024 at 09:00',
    createdBy: 'Compliance Team',
    createdDate: '1/10/2024',
    priority: 'High',
    status: 'Snoozed',
    type: 'Email'
  },
  {
    id: '2',
    title: 'Follow up on valuation',
    description: 'Check status of property valuation for Innovation Corp',
    assignedTo: 'Emma Williams',
    client: 'Innovation Corp',
    dueDate: '1/14/2024 at 14:00',
    createdBy: 'Admin Team',
    createdDate: '1/12/2024',
    priority: 'Medium',
    status: 'Overdue',
    type: 'In-App'
  },
  {
    id: '3',
    title: 'Document verification backlog',
    description: 'High volume of pending document verifications requiring attention',
    assignedTo: 'Admin Team',
    dueDate: '1/15/2024 at 16:00',
    createdBy: 'System',
    createdDate: '1/15/2024',
    priority: 'High',
    status: 'Active',
    type: 'Both'
  }
];

const RemindersLists: FC = () => {
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleViewReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Overdue':
        return 'danger';
      case 'Snoozed':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const renderReminderCard = (reminder: Reminder) => (
    <Card key={reminder.id} className="d-flex flex-row justify-content-between align-items-start bg-light-dark p-3 mb-3">
      <div className="d-flex align-items-start gap-3">
        <div className="mt-1">
          <TbCalendarTime size={20} className="text-primary" />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <p className="mb-0 fw-medium">{reminder.title}</p>
            <Badge color={getStatusColor(reminder.status)} className="rounded-pill px-2 py-1">
              {reminder.status}
            </Badge>
            <Badge color={getPriorityColor(reminder.priority)} className="rounded-pill px-2 py-1">
              {reminder.priority}
            </Badge>
            {reminder.type === 'Recurring' && (
              <Badge color="info" className="rounded-pill px-2 py-1">
                {reminder.type}
              </Badge>
            )}
          </div>
          <p className="mb-2 text-muted">{reminder.description}</p>
          <div className="d-flex align-items-center gap-2 text-muted small">
            <span>Assigned to: {reminder.assignedTo}</span>
            {reminder.client && (
              <>
                <span>•</span>
                <span>Client: {reminder.client}</span>
              </>
            )}
            <span>•</span>
            <span>Due: {reminder.dueDate}</span>
          </div>
          <div className="text-muted small">
            Created by {reminder.createdBy} on {reminder.createdDate}
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-ghost p-0">
          <TbBell size={20} />
        </button>
        <button className="btn btn-ghost p-0 text-success">
          <TbCheck size={20} />
        </button>
        <button className="btn btn-ghost p-0 text-danger">
          <TbX size={20} />
        </button>
      </div>
    </Card>
  );

  return (
    <>
      <Card className="border-0 shadow-sm p-3 h-[400px] overflow-auto">
        <div className=" d-flex justify-content-between align-items-center mb-2">
          <p className="fs-5 fw-semibold mb-3">
            Reminders & Alerts (<span>{reminders.length}</span>)
          </p>
          <div>
            <Badge color="info" className="py-2 px-3 rounded-pill">
              <small>1 Active</small>
            </Badge>
            <Badge color="danger" className="py-2 px-3 rounded-pill">
              <small>1 Overdue</small>
            </Badge>
          </div>
        </div>
        {reminders.map(renderReminderCard)}
      </Card>

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>Reminder Details</ModalHeader>
        <ModalBody>
          {selectedReminder && (
            <Row>
              <Col md={6}>
                <p className="fw-bold mb-1">Title</p>
                <p className="text-muted">{selectedReminder.title}</p>

                <p className="fw-bold mb-1">Description</p>
                <p className="text-muted">{selectedReminder.description}</p>

                <p className="fw-bold mb-1">Assigned To</p>
                <p className="text-muted">{selectedReminder.assignedTo}</p>

                {selectedReminder.client && (
                  <>
                    <p className="fw-bold mb-1">Client</p>
                    <p className="text-muted">{selectedReminder.client}</p>
                  </>
                )}
              </Col>
              <Col md={6}>
                <p className="fw-bold mb-1">Due Date</p>
                <p className="text-muted">{selectedReminder.dueDate}</p>

                <p className="fw-bold mb-1">Status</p>
                <Badge
                  color={getStatusColor(selectedReminder.status)}
                  className="rounded-pill px-2 py-1"
                >
                  {selectedReminder.status}
                </Badge>

                <p className="fw-bold mb-1 mt-3">Priority</p>
                <Badge
                  color={getPriorityColor(selectedReminder.priority)}
                  className="rounded-pill px-2 py-1"
                >
                  {selectedReminder.priority}
                </Badge>

                <p className="fw-bold mb-1 mt-3">Created By</p>
                <p className="text-muted">
                  {selectedReminder.createdBy} on {selectedReminder.createdDate}
                </p>
              </Col>
            </Row>
          )}
        </ModalBody>
      </Modal>
    </>
  );
};

export default RemindersLists;
