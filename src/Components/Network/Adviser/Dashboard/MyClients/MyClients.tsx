import { CommonAdviserClientProps } from "@/Types/Network/Adviser/DashboardTypes";
import React from "react";
import { TbUsers } from "react-icons/tb";
import { Card, CardBody, Spinner } from "reactstrap";

const MyClients: React.FC<CommonAdviserClientProps> = ({
  isLoading,
  adviserClientData,
}) => {
  const renderClientList = isLoading ? (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100%" }}
    >
      <div className="text-center">
        <Spinner color="primary" size="sm" />
        <div className="text-muted mt-2">Loading clients...</div>
      </div>
    </div>
  ) : !adviserClientData ||
    !Array.isArray(adviserClientData) ||
    adviserClientData.length === 0 ? (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100%" }}
    >
      <div className="text-center text-muted">
        <TbUsers size={48} className="mb-2 text-secondary" />
        <div>No clients found.</div>
      </div>
    </div>
  ) : (
    adviserClientData?.map((client, index) => {
      return (
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
      );
    })
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardBody className="p-4">
        <h4 className="text-xl font-semibold mb-3">My Clients</h4>

        <div
          className="client-list space-y-3 overflow-auto p-1"
          style={{ height: "455px", overflowY: "auto" }}
        >
          {renderClientList}
        </div>
      </CardBody>
    </Card>
  );
};

export default MyClients;
