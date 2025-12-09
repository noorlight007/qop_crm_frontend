import { CommonNetworkAdviserClientProps } from "@/Types/Network/Adviser/DashboardTypes";
import React from "react";
import { Card, CardBody } from "reactstrap";

interface ClientData {
  name: string;
  value: string;
  cases: number;
  lastContact: string;
  nextMeeting: string;
  status: string;
}

const MyClients: React.FC<CommonNetworkAdviserClientProps> = ({
  isLoading,
  netAdviserClientData,
}) => {
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
    {
      name: "Michael Chen",
      value: "£280K",
      cases: 1,
      lastContact: "1 week ago",
      nextMeeting: "Friday 2:00 PM",
      status: "Decision In Principle",
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
    <Card className="border-0 shadow-sm">
      <CardBody className="p-4">
        <h4 className="text-xl font-semibold mb-3">My Clients</h4>

        <div
          className="client-list space-y-3 overflow-auto p-1"
          style={{ height: "455px", overflowY: "auto" }}
        >
          {netAdviserClientData.map((client, index) => (
            <Card
              key={index}
              className="border rounded-3 mb-3 hover:shadow-md transition-shadow bg-light-dark"
            >
              <CardBody className="p-3">
                <div>
                  <h5 className="mb-1">{client.name}</h5>
                </div>

                <div className="d-flex gap-4 mb-3 ">
                  <div>
                    <small className="text-muted">Cases:</small>
                    <p className="mb-0">{client.total_cases}</p>
                  </div>
                  <div>
                    <small className="text-muted">Phone:</small>
                    <p className="mb-0">{client.phone}</p>
                  </div>
                  <div>
                    <small className="text-muted">Email:</small>
                    <p className="mb-0">{client.email}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-end">
                  <div className="d-flex gap-2">
                    <a href={`tel:${client.phone}`}>
                      <button className="btn text-primary btn-sm rounded-circle">
                        <i className="fa-solid fa-phone"></i>
                      </button>
                    </a>
                    <a href={`mailto:${client.email}`}>
                      <button className="btn text-success btn-sm rounded-circle">
                        <i className="fa-solid fa-envelope"></i>
                      </button>
                    </a>
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
