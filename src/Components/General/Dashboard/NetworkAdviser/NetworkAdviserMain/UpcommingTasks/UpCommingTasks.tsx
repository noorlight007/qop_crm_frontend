import React from 'react';
import { Card, CardBody, Badge } from 'reactstrap';
import { Calendar } from 'react-feather';

interface Task {
  title: string;
  company: string;
  time: string;
  date?: string;
  isUrgent?: boolean;
}

const UpcomingTasks: React.FC = () => {
  const tasks: Task[] = [
    {
      title: 'Client Review Meeting',
      company: 'Tech Solutions Ltd',
      time: '10:00 AM',
      isUrgent: true
    },
    {
      title: 'Document Submission',
      company: 'Global Investments',
      time: '2:00 PM'
    },
    {
      title: 'Follow-up Call',
      company: 'Innovation Corp',
      time: '4:30 PM'
    },
    {
      title: 'Compliance Check',
      company: 'Future Finance',
      time: '3.00 PM',
      isUrgent: true
    }
  ];

  return (
    <Card className="border-0 shadow-sm w-100 h-100">
      <CardBody className="p-4">
        <h4 className="text-xl font-semibold mb-4">Upcoming Tasks</h4>
        <div className="d-flex flex-column gap-3 w-100">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="bg-light rounded-3 p-3 hover:bg-opacity-80 transition-all cursor-pointer w-100"
            >
              <div className="d-flex align-items-center gap-3 w-100">
                <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1 font-medium text-dark">
                        {task.title}
                      </h5>
                      <p className="text-dark mb-0">{task.company}</p>
                    </div>
                    <div>
                      {task.isUrgent && (
                        <Badge color="danger"  className="px-2">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-primary mb-0 font-medium">{task.time}</p>
                  {task.date && (
                    <small className="text-muted">{task.date}</small>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default UpcomingTasks;