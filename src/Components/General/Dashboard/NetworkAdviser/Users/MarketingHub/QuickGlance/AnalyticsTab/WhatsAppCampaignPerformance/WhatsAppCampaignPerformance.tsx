import React from "react";
import { Chart } from "react-google-charts";
import { Card, CardBody } from "reactstrap";

const data = [
  ["Week", "Delivered", "Read", "Replied"],
  ["Week 1", 120, 100, 10],
  ["Week 2", 150, 110, 15],
  ["Week 3", 90, 60, 8],
  ["Week 4", 200, 160, 20],
];

const options = {
  chartArea: { width: "70%" },
  colors: ["#4285F4", "#34A853", "#FBBC05"],
  backgroundColor: "transparent",
  curveType: "function",
  legend: { position: "top" },
  hAxis: {
    title: "Week",
  },
  vAxis: {
    title: "Count",
    minValue: 0,
  },
  pointSize: 5,
};

const WhatsAppCampaignPerformance: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <h3>WhatsApp Campaign Performance</h3>
        <p>Message delivery and engagement rates</p>
        <div className="google-chart">
          <Chart
            chartType="LineChart"
            width="100%"
            height="300px"
            data={data}
            options={options}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default WhatsAppCampaignPerformance;
