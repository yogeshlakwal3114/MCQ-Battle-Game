
import React from 'react';

const PerformanceChart = ({ correctPercentage, incorrectPercentage, unansweredPercentage }) => {
  const circumference = 2 * Math.PI * 42; // Circumference of the circle with radius 42
  const correctStroke = (correctPercentage / 100) * circumference;
  const incorrectStroke = (incorrectPercentage / 100) * circumference;
  const unansweredStroke = (unansweredPercentage / 100) * circumference;

  const getStrokeDasharray = (percentage, total) => {
    const stroke = (percentage / 100) * total;
    return `${stroke} ${total - stroke}`;
  };

  return (
    <div className="circle-chart">
      <svg width="100" height="100">
        {/* Base Circle */}
        <circle cx="50" cy="50" r="42" stroke="lightgrey" strokeWidth="15" fill="none" />

        {/* Correct Answers (Green) */}
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="green"
          strokeWidth="15"
          fill="none"
          strokeDasharray={getStrokeDasharray(correctPercentage, circumference)}
          strokeDashoffset="0"
          transform="rotate(-90 50 50)"
        />

        {/* Incorrect Answers (Red) */}
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="red"
          strokeWidth="15"
          fill="none"
          strokeDasharray={getStrokeDasharray(incorrectPercentage, circumference)}
          strokeDashoffset={-correctStroke}
          transform="rotate(-90 50 50)"
        />

        {/* Unanswered/Draws (Grey) */}
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="grey"
          strokeWidth="15"
          fill="none"
          strokeDasharray={getStrokeDasharray(unansweredPercentage, circumference)}
          strokeDashoffset={-(correctStroke + incorrectStroke)}
          transform="rotate(-90 50 50)"
        />

        {/* Percentage Values */}
        <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="10px" fill="black">
          <tspan x="50" dy="-1.2em" fill="green" fontSize='12px'>{correctPercentage.toFixed(1)}%</tspan>
          <tspan x="50" dy="1.5em" fill="red" fontSize='12px'>{incorrectPercentage.toFixed(1)}%</tspan>
          <tspan x="50" dy="1.5em" fill="grey" fontSize='12px'>{unansweredPercentage.toFixed(1)}%</tspan>
        </text>
      </svg>
    </div>
  );
};

export default PerformanceChart;
