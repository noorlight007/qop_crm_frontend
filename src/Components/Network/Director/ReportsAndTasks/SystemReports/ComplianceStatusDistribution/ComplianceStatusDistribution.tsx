import React from "react";
import { Chart } from "react-google-charts";
import { Card, CardBody, Col } from "reactstrap";

const ComplianceStatusDistribution: React.FC = () => {
  const data = [
    ["Status", "Percentage"],
    ["Compliant", 61],
    ["Minor Issues", 29],
    ["Major Issues", 10],
  ];

  const options = {
    title: "Compliance Status Distribution",
    backgroundColor: "transparent",
    is3D: true,
    colors: ["#10b981", "#9ca3af", "#0ea5e9"],
    pieHole: 0.4,
    pieStartAngle: 0,
    slices: {
      0: { offset: 0.05 },
    },
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        fontSize: 14,
      },
    },
    chartArea: {
      width: "90%",
      height: "80%",
    },
    pieSliceText: "percentage",
  };

  return (
    <Col md="6">
      <Card className="shadow-sm">
        <CardBody className="google-chart">
          <Chart
            chartType="PieChart"
            width={"100%"}
            height={"365px"}
            data={data}
            options={options}
          />
        </CardBody>
      </Card>
    </Col>
  );
};

export default ComplianceStatusDistribution;
