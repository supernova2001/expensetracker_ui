import react from "react";

const ChartComponent = ({ expensesData }) => {
    const config = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Monthly Expenses'
      },
      xAxis: {
        categories: expensesData.map(item => item.month),
        title: {
          text: 'Month'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Expenses'
        }
      },
      series: [{
        name: 'Expenses',
        data: expensesData.map(item => item.amount)
      }]
    };
  
    return (
      <ReactHighcharts config={config} />
    );
  };
  
  export default ChartComponent;
  