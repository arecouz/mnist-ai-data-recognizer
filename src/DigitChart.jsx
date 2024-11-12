import Plot from 'react-plotly.js';

const DigitChart = ({ data }) => {
  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
          y: data,
        },
      ]}
      layout={{
        width: 580,
        height: 440,
        title: { text: 'Prediction' },
        xaxis: {
          tickmode: 'array',
          tickvals: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], // specify all tick values
        },
      }}
    />
  );
};

export default DigitChart;
