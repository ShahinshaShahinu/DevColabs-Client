
import React, { useEffect } from "react";
import { Chart, initTE } from "tw-elements";

// Initialize the Chart from "tw-elements"
initTE({ Chart });

const RoundedChart: React.FC = () => {
  // Define the chart data and options
 const dataChartDataLabelsExample = {
  type: "pie",
  data: {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        data: [30, 45, 62, 65, 61],
        backgroundColor: [
          "rgba(63, 81, 181, 0.5)",
          "rgba(77, 182, 172, 0.5)",
          "rgba(66, 133, 244, 0.5)",
          "rgba(156, 39, 176, 0.5)",
          "rgba(233, 30, 99, 0.5)",
        ],
        label: "Traffic", // A single label for all months
      },
    ],
  },
};


  const optionsChartDataLabelsExample = {
    dataLabelsPlugin: true,
    options: {
      plugins: {
        datalabels: {
          formatter: (value: number) => {
            let sum = 0;
            // Assign the data to the variable and format it according to your needs
            let dataArr = dataChartDataLabelsExample.data.datasets[0].data;
            dataArr.map((data: number) => {
              sum += data;
            });
            let percentage = ((value * 100) / sum).toFixed(2) + "%";
            return percentage;
          },
          color: "white",
          labels: {
            title: {
              font: {
                size: "14",
              },
            },
          },
        },
      },
    },
  };

  useEffect(() => {
    // Initialize the chart once the component is mounted
    new Chart(
      document.getElementById("chart-data-mdb-labels-example") as HTMLElement,
      dataChartDataLabelsExample,
      optionsChartDataLabelsExample
    );
  }, []);

  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Number of Posts per Month</h2>
      <div
        id="chart-data-mdb-labels-example"
        className="w-full h-64" // Adjust height as needed
      ></div>
    </div>
  );
};

export default RoundedChart;
