import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Plugin
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface XPWebChartProps {
  data: Record<string, number>;
  onCategoryClick: (category: string) => void;
}

export default function XPWebChart({ data, onCategoryClick }: XPWebChartProps) {
  const categories = Object.keys(data);
  const values = Object.values(data);
  const maxXP = Math.max(...values);
  const mousePosition = useRef({ x: 0, y: 0 });

  // Custom plugin to handle label clicks, hover effects, and custom rendering
  const labelClickPlugin: Plugin = {
    id: 'labelClick',
    beforeDraw(chart) {
      chart.canvas.style.cursor = 'default';
    },
    afterDraw(chart) {
      const ctx = chart.ctx;
      const centerX = chart.chartArea.left + chart.chartArea.width / 2;
      const centerY = chart.chartArea.top + chart.chartArea.height / 2;
      const radius = Math.min(chart.chartArea.width, chart.chartArea.height) / 2;

      // Draw labels at the correct positions
      categories.forEach((category, i) => {
        const angle = (i * 2 * Math.PI / categories.length) - Math.PI / 2;
        const value = values[i];
        
        // Calculate label position (slightly outside the chart)
        const labelRadius = radius + 40; // Increased padding for labels
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        
        // Calculate if mouse is near this label
        const distance = Math.sqrt(
          Math.pow(mousePosition.current.x - x, 2) + 
          Math.pow(mousePosition.current.y - y, 2)
        );
        const isHovered = distance < 40;

        // Save current context state
        ctx.save();
        
        // Draw hover effect background if hovered
        if (isHovered) {
          ctx.beginPath();
          ctx.fillStyle = 'rgba(147, 51, 234, 0.1)';
          ctx.arc(x, y + 10, 45, 0, 2 * Math.PI);
          ctx.fill();
          chart.canvas.style.cursor = 'pointer';
        }
        
        // Category text
        ctx.font = `${isHovered ? '600' : '500'} 14px system-ui`;
        ctx.fillStyle = isHovered ? '#4B5563' : '#6B7280'; // Darker gray when hovered
        ctx.textAlign = 'center';
        ctx.fillText(category, x, y);
        
        // XP value
        ctx.font = `${isHovered ? '700' : '600'} 14px system-ui`;
        ctx.fillStyle = '#9333EA'; // Purple for XP
        ctx.fillText(`${value} XP`, x, y + 20);
        
        // Restore context state
        ctx.restore();
      });
    },
    afterEvent(chart, args) {
      const { event } = args;
      if (!event.native) return;

      const canvas = chart.canvas;
      const rect = canvas.getBoundingClientRect();
      const x = event.native.clientX - rect.left;
      const y = event.native.clientY - rect.top;

      // Update mouse position
      mousePosition.current = { x, y };
      chart.draw();

      const centerX = chart.chartArea.left + chart.chartArea.width / 2;
      const centerY = chart.chartArea.top + chart.chartArea.height / 2;
      const radius = Math.min(chart.chartArea.width, chart.chartArea.height) / 2;
      const labelRadius = radius + 40; // Match the label radius from above

      // Check if mouse is near any label
      categories.forEach((category, i) => {
        const angle = (i * 2 * Math.PI / categories.length) - Math.PI / 2;
        const labelX = centerX + Math.cos(angle) * labelRadius;
        const labelY = centerY + Math.sin(angle) * labelRadius;

        const distance = Math.sqrt(
          Math.pow(x - labelX, 2) + 
          Math.pow(y - labelY, 2)
        );

        // If within 40px of label center and clicked
        if (distance < 40 && event.type === 'click') {
          onCategoryClick(category);
        }
      });
    }
  };

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'XP Gained This Week',
        data: values,
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(147, 51, 234, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(147, 51, 234, 1)'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 60,    // Increased padding to prevent label cutoff
        bottom: 60,
        left: 60,
        right: 60
      }
    },
    scales: {
      r: {
        min: 0,
        max: maxXP,
        ticks: {
          stepSize: Math.ceil(maxXP / 5),
          display: false
        },
        pointLabels: {
          display: false // Hide default labels since we're custom rendering
        },
        grid: {
          circular: true,
          color: 'rgba(147, 51, 234, 0.1)'
        },
        angleLines: {
          color: 'rgba(147, 51, 234, 0.1)'
        }
      }
    },
    plugins: {
      tooltip: {
        enabled: false
      },
      legend: {
        display: false
      }
    },
    elements: {
      point: {
        radius: 6,
        borderWidth: 2,
        hoverRadius: 6,
        hitRadius: 40
      },
      line: {
        tension: 0.4
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Life Balance XP</h2>
      <div className="h-[600px] w-full"> {/* Increased height to accommodate labels */}
        <Radar data={chartData} options={options} plugins={[labelClickPlugin]} />
      </div>
    </div>
  );
}