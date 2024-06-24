// Chart data setup
let charts;
const ctx = document.getElementById("myChart");

export function chart(Xaxis, Yaxis) {
  let time = Xaxis.map((element) => {
    return new Date(element * 1000).toLocaleDateString();
  });
  const data = {
    labels: time,
    datasets: [
      {
        label: "Value in dollars",
        data: Yaxis,
        borderColor: "rgb(10, 228, 43)",
        spanGaps: true,
      },
    ],
  };

  //vertical line
  let intersectDataVerticalLine = {
    id: "intersectDataVerticalLine",
    beforeDraw: (chart) => {
      if (chart.getActiveElements().length) {
        const activePoint = chart.getActiveElements()[0];
        const chartArea = chart.chartArea;
        const ctx = chart.ctx;
        ctx.beginPath();
        ctx.moveTo(activePoint.element.x, chartArea.top);
        ctx.lineTo(activePoint.element.x, chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = chart.data.datasets[0].borderColor;
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  //   chart options setup
  const genericOptions = {
    fill: false,
    animation: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    radius: 0,
  };

  // Chart config
  const config = {
    type: "line",
    data,
    options: genericOptions,
    plugins: [intersectDataVerticalLine],
  };

  // Chart init
  if (charts) charts.destroy();
  charts = new Chart(ctx, config);
}
