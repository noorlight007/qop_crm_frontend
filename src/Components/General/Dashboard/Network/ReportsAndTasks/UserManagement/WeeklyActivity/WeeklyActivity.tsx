import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, Col } from "reactstrap";

const WeeklyActivity: React.FC = () => {
  const options: ApexOptions = {
    chart: {
      type: "bar", // Now correctly typed
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 2,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#20c997", "#ffa07a", "#90ee90"],
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yaxis: {
      title: {
        text: "Amount",
      },
      labels: {
        formatter: (value: number) => `${value}k`,
      },
    },
    grid: {
      borderColor: "#f5f5f5",
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}k`,
      },
    },
  };

  const series = [
    {
      name: "Sales",
      data: [1000, 1150, 650, 1000, 1200, 900, 800],
    },
    {
      name: "Expenses",
      data: [400, 450, 1100, 550, 500, 450, 600],
    },
    {
      name: "Profit",
      data: [250, 300, 400, 450, 350, 300, 200],
    },
  ];

  return (
    <Col md="6" sm="12">
      <Card>
        <CardBody className="p-4">
          <h3 className="mb-3">Daily Activity Overview</h3>
          <div className="apex-chart">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={365}
            />
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default WeeklyActivity;
