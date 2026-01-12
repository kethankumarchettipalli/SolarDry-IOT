import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { SensorData, CropConfig } from "@/lib/shared";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SensorChartProps {
  data: SensorData[];
  selectedCrop: CropConfig | null;
  chartType: "temperature" | "humidity" | "combined";
}

export const SensorChart: React.FC<SensorChartProps> = ({
  data,
  selectedCrop,
  chartType,
}) => {
  const chartRef = useRef<ChartJS<"line"> | null>(null);

  const labels = data.map((d) =>
    d.timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const temperatureData = data.map((d) => d.temperature);
  const humidityData = data.map((d) => d.humidity);

  const tempColor = "hsl(0, 75%, 55%)";
  const humidityColor = "hsl(205, 75%, 50%)";
  const thresholdColor = "hsl(38, 92%, 50%)";

  const getChartData = (): ChartData<"line"> => {
    const datasets: ChartData<"line">["datasets"] = [];

    if (chartType === "temperature" || chartType === "combined") {
      datasets.push({
        label: "Temperature (°C)",
        data: temperatureData,
        borderColor: tempColor,
        backgroundColor: `${tempColor.replace(")", ", 0.1)")}`,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        yAxisID: "y",
      });

      if (selectedCrop) {
        datasets.push({
          label: "Temp Max Threshold",
          data: Array(data.length).fill(selectedCrop.targetTempMax),
          borderColor: thresholdColor,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          yAxisID: "y",
        });
        datasets.push({
          label: "Temp Min Threshold",
          data: Array(data.length).fill(selectedCrop.targetTempMin),
          borderColor: thresholdColor,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          yAxisID: "y",
        });
      }
    }

    if (chartType === "humidity" || chartType === "combined") {
      datasets.push({
        label: "Humidity (%)",
        data: humidityData,
        borderColor: humidityColor,
        backgroundColor: `${humidityColor.replace(")", ", 0.1)")}`,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        yAxisID: chartType === "combined" ? "y1" : "y",
      });

      if (selectedCrop && chartType === "humidity") {
        datasets.push({
          label: "Humidity Max Threshold",
          data: Array(data.length).fill(selectedCrop.targetHumidityMax),
          borderColor: thresholdColor,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          yAxisID: "y",
        });
        datasets.push({
          label: "Humidity Min Threshold",
          data: Array(data.length).fill(selectedCrop.targetHumidityMin),
          borderColor: thresholdColor,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          yAxisID: "y",
        });
      }
    }

    return { labels, datasets };
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "Plus Jakarta Sans",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "hsl(215, 25%, 15%)",
        titleFont: {
          family: "Plus Jakarta Sans",
          size: 13,
        },
        bodyFont: {
          family: "Plus Jakarta Sans",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          font: {
            family: "Plus Jakarta Sans",
            size: 11,
          },
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: chartType === "humidity" ? "Humidity (%)" : "Temperature (°C)",
          font: {
            family: "Plus Jakarta Sans",
            size: 12,
          },
        },
        grid: {
          color: "hsl(210, 15%, 90%)",
        },
        ticks: {
          font: {
            family: "Plus Jakarta Sans",
            size: 11,
          },
        },
      },
      ...(chartType === "combined" && {
        y1: {
          type: "linear" as const,
          display: true,
          position: "right" as const,
          title: {
            display: true,
            text: "Humidity (%)",
            font: {
              family: "Plus Jakarta Sans",
              size: 12,
            },
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              family: "Plus Jakarta Sans",
              size: 11,
            },
          },
        },
      }),
    },
  };

  return (
    <div className="h-[300px] sm:h-[400px]">
      <Line ref={chartRef} data={getChartData()} options={options} />
    </div>
  );
};
