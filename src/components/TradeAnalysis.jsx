import React, { useState, useEffect } from 'react';

// This component assumes Tailwind CSS is configured in your Astro project.
// You would typically pass 'tradeData' as a prop from your Astro page
// after loading and processing your CSV.
// For demonstration, we'll use a sample of your 'profit' and 'points' data.

const sampleTradeProfits = [
  -253.1, 59.4, 21.9, 36.8, -199.1, 37.8, -12.4, 38.6, 12.8, 114.7, -626.8,
  25.4, 150.1, -286.9, 199.8, -377.9, -125.6, 112.5, 112.5, 75.3, 12.9,
  350.0, 137.9, 137.9, 162.7, 59.4, -850.1, 37.9, 584.4, 50.2, 25.0,
  -1318.7, 212.8, -62.4, 50.2, 38.6, 50.2, 50.2, 112.5
];

const sampleTradePoints = [
  -5.00, 1.25, 0.50, 0.75, -4.00, 0.75, -0.25, 0.75, 0.25, 2.25, -12.50,
  0.50, 3.00, -5.75, 4.00, -7.50, -2.50, 2.25, 2.25, 1.50, 0.25, 7.00,
  2.75, 2.75, 3.25, 1.25, -17.00, 0.75, 11.75, 1.00, 0.50, -26.25, 4.25,
  -1.25, 1.00, 0.75, 1.00, 1.00, 2.25
];

const TradeAnalysis = ({ tradeProfits = [], tradePoints = [] } = {}) => { // Accept props here with defaults
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [winLossRatio, setWinLossRatio] = useState(0);
  const [maxWin, setMaxWin] = useState(0);
  const [maxLoss, setMaxLoss] = useState(0);
  const [pointsData, setPointsData] = useState([]);
  const [pointsStats, setPointsStats] = useState({});

  useEffect(() => {
    // Use props if provided and not empty, otherwise fallback to sample data
    const profitsToUse = tradeProfits && tradeProfits.length > 0 ? tradeProfits : sampleTradeProfits;
    const pointsToUse = tradePoints && tradePoints.length > 0 ? tradePoints : sampleTradePoints;

    // Perform calculations using profitsToUse
    const calculatedWins = profitsToUse.filter(p => p > 0).length;
    const calculatedLosses = profitsToUse.filter(p => p < 0).length;
    const calculatedWinLossRatio = calculatedLosses > 0 ? calculatedWins / calculatedLosses : (calculatedWins > 0 ? calculatedWins : 0);

    const positiveProfits = profitsToUse.filter(p => p > 0);
    const negativeProfits = profitsToUse.filter(p => p < 0);

    const calculatedMaxWin = positiveProfits.length > 0 ? Math.max(...positiveProfits) : 0;
    const calculatedMaxLoss = negativeProfits.length > 0 ? Math.min(...negativeProfits) : 0;

    setWins(calculatedWins);
    setLosses(calculatedLosses);
    setWinLossRatio(calculatedWinLossRatio);
    setMaxWin(calculatedMaxWin);
    setMaxLoss(calculatedMaxLoss);
    setPointsData(pointsToUse);

    // Calculate descriptive statistics for points
    if (pointsToUse.length > 0) {
      const sum = pointsToUse.reduce((a, b) => a + b, 0);
      const mean = sum / pointsToUse.length;
      const squaredDiffs = pointsToUse.map(x => (x - mean) ** 2);
      const variance = squaredDiffs.reduce((a, b) => a + b, 0) / pointsToUse.length;
      const stdDev = Math.sqrt(variance);
      const sortedPoints = [...pointsToUse].sort((a, b) => a - b);
      const min = sortedPoints[0];
      const max = sortedPoints[sortedPoints.length - 1];

      // Handle quartiles for small arrays, defaulting to 0 if not enough data points
      const getQuartile = (arr, q) => {
        const index = Math.floor(arr.length * q);
        return arr[index] !== undefined ? arr[index] : 0;
      };

      const q1 = getQuartile(sortedPoints, 0.25);
      const median = getQuartile(sortedPoints, 0.5);
      const q3 = getQuartile(sortedPoints, 0.75);

      setPointsStats({
        count: pointsToUse.length,
        mean: mean,
        std: stdDev,
        min: min,
        '25%': q1,
        '50%': median,
        '75%': q3,
        max: max
      });
    } else {
      setPointsStats({}); // Clear stats if no points data
    }

  }, [tradeProfits, tradePoints]); // Add props to dependency array so useEffect re-runs when they change

  // Simple Bar Chart Component
  const BarChart = ({ data, title, barColors }) => {
    // Determine the maximum absolute value for scaling, ensure it's not zero
    const maxAbsValue = Math.max(...data.map(d => Math.abs(d.value)));
    const scaleFactor = maxAbsValue > 0 ? (maxAbsValue / 100) : 1; // Prevent division by zero

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>
        <div className="flex justify-around items-end h-40">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center mx-2">
              <div
                className="rounded-t-md w-12"
                style={{
                  height: `${Math.max(20, Math.abs(item.value) / scaleFactor)}px`, // Min height of 20px
                  backgroundColor: barColors[index % barColors.length],
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700 mt-2">{item.label}</span>
              <span className="text-xs text-gray-500">{item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8 font-inter text-gray-900 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
          Trade Performance Dashboard
        </h1>

        {/* Win/Loss Ratio Section */}
        <div className="bg-purple-50 p-6 rounded-lg shadow-inner border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">Win/Loss Overview</h2>
          <div className="flex flex-col md:flex-row justify-around items-center text-center space-y-4 md:space-y-0">
            <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
              <p className="text-xl font-semibold text-gray-700">Total Wins</p>
              <p className="text-3xl font-bold text-green-600">{wins}</p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
              <p className="text-xl font-semibold text-gray-700">Total Losses</p>
              <p className="text-3xl font-bold text-red-600">{losses}</p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
              <p className="text-xl font-semibold text-gray-700">Win/Loss Ratio</p>
              <p className="text-3xl font-bold text-blue-600">{winLossRatio.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <BarChart
              data={[{ label: 'Wins', value: wins }, { label: 'Losses', value: losses }]}
              title="Trade Wins vs. Losses"
              barColors={['#34D399', '#EF4444']} // Green for wins, Red for losses
            />
          </div>
        </div>

        {/* Max Win/Loss Section */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-inner border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Maximum Profit & Loss</h2>
          <div className="flex flex-col md:flex-row justify-around items-center text-center space-y-4 md:space-y-0">
            <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
              <p className="text-xl font-semibold text-gray-700">Maximum Win</p>
              <p className="text-3xl font-bold text-green-600">${maxWin.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-md flex-1 mx-2">
              <p className="text-xl font-semibold text-gray-700">Maximum Loss</p>
              <p className="text-3xl font-bold text-red-600">${maxLoss.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <BarChart
              data={[{ label: 'Max Win', value: maxWin }, { label: 'Max Loss', value: maxLoss }]}
              title="Maximum Win vs. Maximum Loss"
              barColors={['#10B981', '#DC2626']} // Green for win, Red for loss
            />
          </div>
        </div>

        {/* Points Section */}
        <div className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
          <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">Points Per Trade</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-center max-h-60 overflow-y-auto p-2 rounded-md bg-white shadow-inner">
            {pointsData.map((points, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  points > 0 ? 'bg-green-100 text-green-800' : (points < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800')
                }`}
              >
                {points.toFixed(2)}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-green-700 mt-6 mb-3 text-center">Points Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-md shadow-inner">
            {Object.entries(pointsStats).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
                <span className="font-semibold text-gray-700">{key.replace('%', ' Percent')}:</span>
                <span className="text-gray-900 font-bold">{value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer/Instructions */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner text-sm text-gray-600 mt-8 border border-gray-200">
          <p className="font-semibold mb-2">Note on Data Source:</p>
          <div>
            This component currently uses sample profit and points data hardcoded within the component for demonstration.
            In your Astro project, you should load your `orders.csv` file (e.g., using `PapaParse` in a server-side Astro component or client-side fetch),
            process the 'profit' and 'points' columns, and then pass these arrays as props to this `TradeAnalysis` component.
            For example:
            <pre className="bg-gray-100 p-2 rounded-md text-xs mt-1">
              <code className="language-html">
                &lt;TradeAnalysis tradeProfits=&#123;yourProcessedProfitsArray&#125; tradePoints=&#123;yourProcessedPointsArray&#125; client:load /&gt;
              </code>
            </pre>
            (Replace `yourProcessedProfitsArray` and `yourProcessedPointsArray` with actual JavaScript arrays you've loaded from your CSV in your Astro page's frontmatter.)
          </div>
          <p className="mt-2 font-semibold">Usage in Astro:</p>
          <ol className="list-decimal list-inside ml-4">
            <li>This component is saved as `TradeAnalysis.jsx` in your components folder.</li>
            <li>Import it in your Astro page:
              <pre className="bg-gray-100 p-2 rounded-md text-xs mt-1">
                <code className="language-javascript">import TradeAnalysis from '../components/TradeAnalysis.jsx';</code>
              </pre>
            </li>
            <li>Render it in your Astro page with the `client:load` directive for client-side interactivity:
              <pre className="bg-gray-100 p-2 rounded-md text-xs mt-1">
                <code className="language-html">
                  &lt;TradeAnalysis client:load /&gt;
                </code>
              </pre>
            </li>
            <li>Ensure Tailwind CSS is configured in your Astro project.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TradeAnalysis;