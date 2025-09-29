import { CommonDashboardProps } from "@/Types/CommonComponents/CommonDashboard/CommonDashboardType";
import React from "react";
import {
  TbFileCheck,
  TbFileInvoice,
  TbFileText,
  TbFileX,
  TbShield,
} from "react-icons/tb";
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";

const PerformanceOverview: React.FC<CommonDashboardProps> = ({
  isLoading,
  commonDashboardData,
}) => {
  const performanceCards = [
    {
      title: "New Mortgage Enquiry",
      value: commonDashboardData?.summary_cards?.new_mortgage_enquiry ?? 0,
      icon: TbFileInvoice,
      bgColor: "bg-primary",
    },
    {
      title: "Mortgage Cases Submitted",
      value: commonDashboardData?.summary_cards?.mortgage_cases_submitted ?? 0,
      icon: TbFileText,
      bgColor: "bg-success",
    },
    {
      title: "Mortgage Cases Offered",
      value: commonDashboardData?.summary_cards?.mortgage_cases_offered ?? 0,
      icon: TbFileCheck,
      bgColor: "bg-warning",
    },
    {
      title: "Mortgage Cases Completed",
      value: commonDashboardData?.summary_cards?.mortgage_cases_completed ?? 0,
      icon: TbFileX,
      bgColor: "bg-info",
    },
    {
      title: "Insurance Cases Submitted",
      value: commonDashboardData?.summary_cards?.insurance_cases_submitted ?? 0,
      icon: TbShield,
      bgColor: "bg-secondary",
    },
  ];

  return (
    <>
      <Row className="py-2">
        {isLoading
          ? // Skeleton Loaders
            [...Array(5)].map((_, index) => {
              // First 3 cards take 4 columns each (3 cards per row)
              // Last 2 cards take 6 columns each (2 cards per row, full width)
              const colSize =
                index < 3 ? { xl: 4, lg: 4, md: 6 } : { xl: 6, lg: 6, md: 6 };

              return (
                <Col {...colSize} sm={12} key={index}>
                  <Card className="border-0 rounded-2 shadow-sm bg-white">
                    <CardBody className="p-4">
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "70%" }}>
                          <div
                            className="skeleton-loading mb-2"
                            style={{
                              width: "80%",
                              height: "16px",
                              backgroundColor: "#e0e0e0",
                            }}
                          />
                          <div
                            className="skeleton-loading"
                            style={{
                              width: "50%",
                              height: "24px",
                              backgroundColor: "#e0e0e0",
                            }}
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })
          : // Render actual performance cards
            performanceCards.map((card, index) => {
              const IconComponent = card.icon;
              // First 3 cards take 4 columns each (3 cards per row)
              // Last 2 cards take 6 columns each (2 cards per row, full width)
              const colSize =
                index < 3 ? { xl: 4, lg: 4, md: 6 } : { xl: 6, lg: 6, md: 6 };

              return (
                <Col {...colSize} sm={12} key={index}>
                  <Card className="border-0 shadow ">
                    <CardBody className="p-4">
                      <div className="d-flex justify-content-between">
                        <div>
                          <CardTitle className="text-muted small fw-bold text-truncate">
                            {card.title}
                          </CardTitle>
                          <h4 className="mb-1 text-dark">{card.value}</h4>
                        </div>
                        <div>
                          <span
                            className={`d-flex justify-content-center align-items-center ${card.bgColor} bg-opacity-25 rounded-3`}
                            style={{ width: "30px", height: "30px" }}
                          >
                            <IconComponent className="fs-6 text-white" />
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
      </Row>
    </>
  );
};

export default PerformanceOverview;
