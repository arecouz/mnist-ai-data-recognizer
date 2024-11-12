import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const Stats = ({ stats }) => {
  const [data, setData] = useState([{
    x: [], // X values (iterations)
    y: [], // Y values (errors)
    mode: 'lines',
    line: { color: 'blue' },
  }]);

  useEffect(() => {
    // Extract errors and iterations (or use index as x) from the stats array
    const xValues = stats.map((_, index) => index); // or `stats.map((stat) => stat.iteration);` if iteration is available
    const yValues = stats.map((stat) => stat.error); // Extract error values

    // Update data array with new values
    setData([{
      x: xValues,
      y: yValues,
      mode: 'lines',
      line: { color: 'blue' },
    }]);
  }, [stats]); // Update plot whenever stats changes

  return (
    <Plot
      data={data}
      layout={{
        title: 'Error Progression',
        xaxis: {
          title: 'Iterations',
          range: [0, stats.length], // X axis starts at 0 and goes up to the number of iterations
          fixedrange: true,
        },
        yaxis: {
          title: 'Error Threshold',
        },
        shapes: [
          {
            type: 'line',
            x0: 0, // Start at the first iteration
            x1: stats.length, // Extend to the last iteration
            y0: 0.005, // Y position of the horizontal line
            y1: 0.005, // Same as y0 for a horizontal line
            line: {
              color: 'red',
              width: 2,
              dash: 'dash', // Dashed line for the error threshold
            },
          },
        ],
        annotations: [
          {
            x: stats.length * 0.9,  // Position the label near the end of the line
            y: 0.005,  // Y position of the line
            xanchor: 'left',
            yanchor: 'bottom',
            text: 'Error Threshold (0.005)', // The label text
            font: {
              size: 12,
              color: 'red',
            },
            showarrow: false, // No arrow pointing to the line
          },
        ],
        transition: { duration: 500, easing: 'cubic-in-out' },
      }}
      config={{ responsive: false }}
    />
  );
};

export default Stats;
