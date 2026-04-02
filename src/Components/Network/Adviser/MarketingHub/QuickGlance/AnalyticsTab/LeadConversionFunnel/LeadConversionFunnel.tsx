import React from "react";
import { Chart } from "react-google-charts";
import { Card, CardBody } from "reactstrap";

const data = [
  ["Month", "Leads", "Qualified", "Approved", "Completed"],
  ["Oct", 10, 4, 3, 12],
  ["Nov", 14, 6, 5, 15],
  ["Dec", 13, 7, 6, 14],
];

const options = {
  isStacked: true,
  chartArea: { width: "70%" },
  colors: ["#c9b037", "#0081a7", "#00afb9", "#a259ff"],
  backgroundColor: "transparent",
  legend: { position: "top" },
  hAxis: {
    title: "Month",
  },
  vAxis: {
    title: "Count",
    minValue: 0,
  },
  areaOpacity: 0.7,
};

const LeadConversionFunnel: React.FC = () => {
  return (
    <Card>
      <CardBody>
        <h3>Lead Conversion Funnel</h3>
        <p>Track leads through to mortgage completions</p>
        <div className="google-chart">
          <Chart
            chartType="AreaChart"
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

export default LeadConversionFunnel;
