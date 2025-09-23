import React from "react";
import Chart from "react-apexcharts";
import { Card, CardBody } from "reactstrap";

const series = [340, 180, 120, 80];
const labels = ["Facebook Ads", "Instagram Ads", "LinkedIn Ads", "WhatsApp"];
const colors = ["#4285F4", "#EA4C89", "#00B6F0", "#00C48C"];

const options = {
  chart: {
    type: "donut",
  },
  labels: labels,
  colors: colors,
  legend: {
    show: true,
    position: "right",
    fontSize: "14px",
    fontWeight: 600,
    labels: {
      colors: colors, // This will color the legend text to match the slices
      useSeriesColors: true,
    },
    markers: {
      width: 16,
      height: 16,
      radius: 8,
    },
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    y: {
      formatter: (val: number, opts: any) => {
        return `£${val}`;
      },
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "55%",
        labels: {
          show: false,
        },
      },
    },
  },
};

const CampaignROIDistribution: React.FC = () => (
  <Card>
    <CardBody>
      <h3>Campaign ROI Distribution</h3>
      <p>Return on investment by marketing channel</p>
      <Chart
        options={options as ApexCharts.ApexOptions}
        series={series}
        type="donut"
        width="100%"
        height="300px"
      />
    </CardBody>
  </Card>
);

export default CampaignROIDistribution;
