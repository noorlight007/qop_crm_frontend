import { useGetSuperAdminDashboardOverviewDataQuery } from "@/Redux/Reducers/SuperAdmin/Dashboard/DashboardApi";
import { OverviewCard } from "@/Types/SuperAdmin/Dashboard/DashboardTypes";
import React from "react";
import { FaNetworkWired } from "react-icons/fa";
import {
  TbBuildingSkyscraper,
  TbCheckbox,
  TbTicket,
  TbUsers,
} from "react-icons/tb";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
  Spinner,
} from "reactstrap";

const Overview: React.FC = () => {
  const {
    data: overviewData,
    isLoading,
    isError,
  } = useGetSuperAdminDashboardOverviewDataQuery(undefined);

  const cards: OverviewCard[] = [
    {
      title: "Networks",
      value: Number((overviewData as any)?.networks ?? 0) || 0,
      icon: FaNetworkWired,
      iconBgClass: "bg-primary",
      loadingSpinnerColor: "primary",
    },
    {
      title: "Organisations",
      value: Number((overviewData as any)?.organisations ?? 0) || 0,
      icon: TbBuildingSkyscraper,
      iconBgClass: "bg-info",
      loadingSpinnerColor: "info",
    },
    {
      title: "New Clients This Month",
      value: Number((overviewData as any)?.new_clients_this_month ?? 0) || 0,
      icon: TbUsers,
      iconBgClass: "bg-success",
      loadingSpinnerColor: "success",
    },
    {
      title: "Total Cases",
      value: Number((overviewData as any)?.total_cases ?? 0) || 0,
      icon: TbCheckbox,
      iconBgClass: "bg-secondary",
      loadingSpinnerColor: "secondary",
    },
    {
      title: "Total Tickets",
      value: Number((overviewData as any)?.total_tickets ?? 0) || 0,
      icon: TbTicket,
      iconBgClass: "bg-warning",
      loadingSpinnerColor: "warning",
    },
    {
      title: "Resolved Tickets",
      value: Number((overviewData as any)?.resolved_tickets ?? 0) || 0,
      icon: TbTicket,
      iconBgClass: "bg-info",
      loadingSpinnerColor: "info",
    },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="bg-transparent border-0 pb-0">
        <h3 className="mb-1">Overview</h3>
        <small className="text-muted">Quick snapshot of current activity</small>
      </CardHeader>
      <CardBody>
        {isError && (
          <div className="small text-danger mb-3">
            Unable to load dashboard summary. Showing defaults.
          </div>
        )}
        <Row className="g-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Col md="4" sm="12" key={index}>
                <Card className="border-0 p-2 rounded-2 shadow-lg">
                  <CardBody className="p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-2" style={{ minWidth: 0 }}>
                        <CardTitle className="small text-muted text-truncate mb-1">
                          {card.title}
                        </CardTitle>

                        {isLoading ? (
                          <div className="d-flex align-items-center">
                            <Spinner
                              color={card.loadingSpinnerColor}
                              size="sm"
                            />
                            <span className="text-muted ms-2">Loading...</span>
                          </div>
                        ) : (
                          <h4 className="mb-0 text-dark">{card.value}</h4>
                        )}
                      </div>

                      <span
                        className={`d-flex justify-content-center align-items-center ${card.iconBgClass} rounded-3`}
                        style={{ width: "30px", height: "30px" }}
                      >
                        <Icon className="fs-6" />
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </CardBody>
    </Card>
  );
};

export default Overview;
