/* eslint-disable react/prop-types */
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Chart = ({ arr = [], currency, days }) => {
  const prices = []
  const date = []
  const increasePrices = [] // Data for price increases (green line)
  const decreasePrices = [] // Data for price decreases (red line)

  for (let i = 0; i < arr.length; i++) {
    const currentPrice = arr[i][1]
    const previousPrice = i > 0 ? arr[i - 1][1] : currentPrice // Handle first point

    // Format date
    if (days === '24h') date.push(new Date(arr[i][0]).toLocaleTimeString())
    else date.push(new Date(arr[i][0]).toLocaleDateString())

    prices.push(currentPrice)

    // Separate data points for increase and decrease
    if (currentPrice > previousPrice) {
      increasePrices.push(currentPrice) // Add to increase line
      decreasePrices.push(null) // No data for decrease at this point
    } else {
      decreasePrices.push(currentPrice) // Add to decrease line
      increasePrices.push(null) // No data for increase at this point
    }
  }
  const isMobile = window.innerWidth < 768
  const lineWidth = isMobile ? 0.5 : 1.5
  const dotRadius = isMobile ? 0.5 : 3
  const hoverDotRadius = isMobile ? 1 : 4
  
    const maxTicksLimit = isMobile ? 4 : 10 

  const data = {
    labels: date,
    datasets: [
      {
        label: `Price Increase in ${currency}`,
        data: increasePrices,
        borderColor: 'rgba(0, 255, 0, 0.7)',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderWidth: lineWidth,
        pointBackgroundColor: 'rgba(0, 255, 0, 0.7)',
        pointRadius: dotRadius,
        pointHoverRadius: hoverDotRadius,
        tension: 0.2,
      },
      {
        label: `Price Decrease in ${currency}`,
        data: decreasePrices,
        borderColor: 'rgba(255, 99, 132, 0.7)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: lineWidth,
        pointBackgroundColor: 'rgba(255, 99, 132, 0.7)',
        pointRadius: dotRadius,
        pointHoverRadius: hoverDotRadius,
        tension: 0.2,
      },
    ],
  }

  return (
    <Line
      options={{
        responsive: true,
        elements: {
          line: {
            tension: 0.1, // Adjust tension for smoother lines
          },
        },
        scales: {
          x: {
            grid: {
              display: true, // Keep grid visible for the X axis
            },
            ticks: {
              maxTicksLimit: maxTicksLimit,
              autoSkip: true,
              maxRotation: 45,
              minRotation: 20,
            },
          },
          y: {
            grid: {
              display: true, // Keep grid visible for the Y axis
            },
            ticks: {
              maxTicksLimit: maxTicksLimit,
            },
          },
        },
        plugins: {
          tooltip: {
            mode: 'index', // Tooltip shows for closest points
            intersect: false, // Allows tooltip to show for hovered area without needing to be on a point
            callbacks: {
              label: (context) => `Price: ${context.parsed.y} ${currency}`,
            },
          },
          crosshair: {
            line: {
              color: 'rgba(0, 0, 0, 0.5)', // Transparent vertical line for crosshair
              width: 1,
            },
          },
        },
        hover: {
          mode: 'index',
          intersect: false,
        },
      }}
      data={data}
    />
  )
}

export default Chart
