import Link from "next/link";
import React from "react";
import { Badge, Card, CardBody } from "reactstrap";

interface ClientData {
  name: string;
  value: string;
  cases: number;
  lastContact: string;
  nextMeeting: string;
  status: string;
}

const MyClients: React.FC = () => {
  const clients: ClientData[] = [
    {
      name: "Sarah Williams",
      value: "£450K",
      cases: 3,
      lastContact: "2 days ago",
      nextMeeting: "Tomorrow 10:00 AM",
      status: "Enquiry",
    },
    {
      name: "Michael Chen",
      value: "£280K",
      cases: 1,
      lastContact: "1 week ago",
      nextMeeting: "Friday 2:00 PM",
      status: "Decision In Principle",
    },
  ];

  return (
    <Card className="border-0 shadow-sm h-100">
      <CardBody className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-xl font-semibold m-0">My Clients</h4>
          <Link href="#" className="btn btn-primary btn-sm rounded-3 px-3">
            View All
          </Link>
        </div>

        <div className="client-list space-y-3">
          {clients.map((client, index) => (
            <Card
              key={index}
              className="border rounded-3 mb-3 hover:shadow-md transition-shadow"
            >
              <CardBody className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="mb-1">{client.name}</h5>
                  </div>
                  <Badge color="secondary" className="text-capitalize">
                    {client.status}
                  </Badge>
                </div>

                <div className="d-flex gap-4 mb-3 ">
                  <div>
                    <small className="text-muted">Value:</small>
                    <p className="mb-0">{client.value}</p>
                  </div>
                  <div>
                    <small className="text-muted">Cases:</small>
                    <p className="mb-0">{client.cases}</p>
                  </div>
                  <div>
                    <small className="text-muted">Last contact:</small>
                    <p className="mb-0">{client.lastContact}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fa-regular fa-calendar text-primary"></i>
                    <span>Next: {client.nextMeeting}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn text-primary btn-sm rounded-circle">
                      <i className="fa-solid fa-phone"></i>
                    </button>
                    <button className="btn text-success btn-sm rounded-circle">
                      <i className="fa-solid fa-envelope"></i>
                    </button>
                    <button className="btn text-warning btn-sm rounded-circle">
                      <i className="fa-solid fa-pen"></i>
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default MyClients;
