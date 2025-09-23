import { ApexOptions } from "apexcharts";

const primary = "var(--theme-default)";
const secondary = "var(--theme-secondary)";

export const OptionsVisitor: ApexOptions = {
  series: [
    {
      name: "Active",
      data: [5000, 6000, 7800, 4000, 5000],
    },
    {
      name: "Bounce",
      data: [8000, 9600, 5600, 9000, 8000],
    },
  ],
  chart: {
    type: "bar",
    height: 225,
    offsetX: -20,
    offsetY: 10,
    toolbar: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "75%",
      borderRadius: 2,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "#e5e5e5",
    xaxis: {
      lines: {
        show: false,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: [secondary, primary],
  xaxis: {
    categories: ["Aug", "Sep", "Oct", "Nov", "Dec"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontSize: "13px",
        fontFamily: "Nunito Sans', sans-serif",
        colors: "#AAA3A0",
        fontWeight: 600,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return "$" + val;
      },
      style: {
        fontSize: "13px",
        fontFamily: "Nunito Sans, sans-serif",
        colors: "#AAA3A0",
        fontWeight: 600,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  responsive: [
    {
      breakpoint: 1541,
      options: {
        chart: {
          height: 233,
        },
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
  ],
};

export const Investment: ApexOptions = {
  series: [76, 67, 61, 90],
  chart: {
    height: 380,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: "30%",
        background: "transparent",
        image: undefined,
      },
      dataLabels: {
        name: {
          fontSize: "22px",
        },
        value: {
          fontSize: "16px",
        },
        total: {
          show: true,
          label: "Total",
          formatter: function (w: any) {
            return "249";
          },
        },
      },
      track: {
        background: "var(--body-color)",
      },
    },
  },
  colors: [primary, secondary, "#ea9200", "#e74b2b"],
  labels: ["Vimeo", "Messenger", "Facebook", "LinkedIn"],
  legend: {
    labels: {
      useSeriesColors: true,
    },
    formatter: function (seriesName, opts) {
      return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
    },
    itemMargin: {
      vertical: 2,
    },
  },
  responsive: [
    {
      breakpoint: 1711,
      options: {
        chart: {
          height: 350,
        },
      },
    },
    {
      breakpoint: 1591,
      options: {
        chart: {
          height: 320,
        },
      },
    },
    {
      breakpoint: 1481,
      options: {
        chart: {
          height: 300,
          offsetX: -10,
        },
      },
    },
    {
      breakpoint: 1435,
      options: {
        chart: {
          offsetX: -20,
        },
      },
    },
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 240,
          offsetX: -10,
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 380,
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        chart: {
          height: 335,
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};

export const GrowthChart: ApexOptions = {
  series: [
    {
      name: "Network",
      data: [
        {
          x: "Jan",
          y: 350,
        },
        {
          x: "Feb",
          y: 600,
        },
        {
          x: "Mar",
          y: 350,
        },
        {
          x: "Apr",
          y: 410,
        },
        {
          x: "May",
          y: 410,
        },
        {
          x: "Jun",
          y: 600,
        },
        {
          x: "Jul",
          y: 500,
        },
        {
          x: "Aug",
          y: 500,
        },
        {
          x: "Sep",
          y: 800,
        },
        {
          x: "Oct",
          y: 410,
        },
        {
          x: "Nov",
          y: 350,
        },
        {
          x: "Dec",
          y: 410,
        },
      ],
    },
  ],
  chart: {
    type: "area",
    height: 350,
    animations: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },
  grid: {
    show: true,
    borderColor: "#e5e5e5",
  },
  fill: {
    opacity: 0.8,
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 0,
      stops: [0, 100],
      colorStops: [],
    },
  },
  colors: ["#308e87"],
  markers: {
    size: 6,
    colors: "var(--body-color)",
    strokeColors: "#308e87",
    strokeWidth: 3,
    strokeOpacity: 1,
    fillOpacity: 0,
    hover: {
      size: 9,
    },
  },
  tooltip: {
    intersect: true,
    shared: false,
  },
  theme: {
    palette: "palette1",
  },
  yaxis: {
    labels: {
      formatter: function (val: number) {
        return val.toString() + "k";
      },
      style: {
        fontSize: "13px",
        fontFamily: "Nunito Sans, sans-serif",
        colors: "#AAA3A0",
        fontWeight: 600,
      },
    },
  },
  xaxis: {
    labels: {
      style: {
        fontSize: "13px",
        fontFamily: "Nunito Sans', sans-serif",
        colors: "#AAA3A0",
        fontWeight: 600,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 255,
        },
      },
    },
    {
      breakpoint: 1321,
      options: {
        chart: {
          height: 260,
        },
      },
    },
    {
      breakpoint: 1252,
      options: {
        chart: {
          height: 275,
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 360,
        },
      },
    },
    {
      breakpoint: 481,
      options: {
        chart: {
          height: 260,
          offsetY: 20,
        },
      },
    },
  ],
};

export const IncomeChart:ApexOptions = {
  series: [46],
  chart: {
    type: "radialBar",
    // offsetY: -10,
    height: 420,
    sparkline: {
      enabled: false, 
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90, 
      track: {
        background: "rgba(48, 142, 135, 0.12)",
        strokeWidth: "100%",
      },
      dataLabels: {
        name: {
          show: true,
          offsetY: -20,
          fontSize: "16px",
          fontWeight: "600",
          color: "#292929",
        },
        value: {
          offsetY: -10,
          fontSize: "16px",
          fontWeight: "600",
          color: "#AAA3A0",
        },
      },
    },
    bar: {
      horizontal: false,
      dataLabels: {
        position: "bottom",
      },
    },
  },
  labels: ["March. 2024"],
  stroke: {
    lineCap: "round",
  },
  grid: {
    padding: {
      top: -40,
    },
  },
  colors: [primary],
  responsive: [
    {
      breakpoint: 1557,
      options: {
        chart: {
          height: 365,
        },
      },
    },
    {
      breakpoint: 1491,
      options: {
        chart: {
          height: 330,
        },
      },
    },
    {
      breakpoint: 1400,
      options: {
        chart: {
          height: 380,
        },
      },
    },
    {
      breakpoint: 1240,
      options: {
        chart: {
          height: 350,
        },
      },
    },
    {
      breakpoint: 1200,
      options: {
        chart: {
          height: 400,
        },
      },
    },
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 300,
        },
      },
    },
  ],
};