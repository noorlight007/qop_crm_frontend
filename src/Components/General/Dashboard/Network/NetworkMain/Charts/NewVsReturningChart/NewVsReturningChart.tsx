import CommonCardHeader from "@/CommonComponent/CommonCardHeader";
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody } from "reactstrap";

const NewVsReturningChart: React.FC = () => {
  const PieChartData: ApexOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["New", "Returning"],
    series: [81, 19],
    responsive: [
      {
        options: {
          chart: {
            height: 220,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    colors: ["#F39159", "#0077FF"],
  };

  return (
    <Card>
      <CommonCardHeader title="New vs Returning" />
      <CardBody className="apex-chart">
        <div id="piechart">
          <ReactApexChart
            options={PieChartData}
            series={PieChartData.series}
            type="pie"
            width={380}
            height={220}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default NewVsReturningChart;
