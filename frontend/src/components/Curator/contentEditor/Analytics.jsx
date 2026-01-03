import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Enhanced color scheme with better contrast and accessibility
const COLORS = ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c", "#9b59b6", "#1abc9c", "#d35400", "#34495e"];

const Analytics = ({ data = null }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculate total for percentages
  const total = analyticsData.reduce((sum, item) => sum + item.value, 0);
  
  // Default data if none is provided (for demo purposes)
  const defaultData = [
    { name: "Posted", value: 15 },
    { name: "Pending", value: 8 },
    { name: "Verified", value: 4 },
    { name: "Rejected", value: 2 },
    { name: "Scheduled", value: 1 },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // If data is provided as a prop, use it
        if (data) {
          setAnalyticsData(data);
        } 
        // Otherwise use default data
        else {
          // Simulate API call with a delay
          await new Promise(resolve => setTimeout(resolve, 800));
          setAnalyticsData(defaultData);
        }
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [data]);

  // Calculate key insights
  const getKeyInsights = () => {
    if (!analyticsData.length) return [];
    
    // Sort by value to find highest and runner-up
    const sorted = [...analyticsData].sort((a, b) => b.value - a.value);
    const highest = sorted[0];
    const runnerUp = sorted[1];
    const lowest = sorted[sorted.length - 1];
    
    return [
      {
        color: COLORS[analyticsData.findIndex(item => item.name === highest.name) % COLORS.length],
        text: `Most content items are in the "${highest.name}" status (${Math.round(highest.value / total * 100)}%)`
      },
      {
        color: COLORS[analyticsData.findIndex(item => item.name === runnerUp.name) % COLORS.length],
        text: `"${runnerUp.name}" items account for ${Math.round(runnerUp.value / total * 100)}% of all content`
      },
      {
        color: COLORS[analyticsData.findIndex(item => item.name === lowest.name) % COLORS.length],
        text: `Only ${Math.round(lowest.value / total * 100)}% of content is currently "${lowest.name}"`
      }
    ];
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-300 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="h-80 bg-gray-300 rounded"></div>
            <div className="h-80 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-red-50 text-red-800 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
        <p>{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const insights = getKeyInsights();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Analytics Overview Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">Analytics Overview</h2>
        <p className="text-gray-600">Summary of content status distribution</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {analyticsData.map((item, index) => (
          <div 
            key={`stat-${index}`} 
            className="bg-white rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition-transform duration-300"
          >
            <p className="text-4xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>{item.value}</p>
            <p className="text-gray-600 font-medium mt-2">{item.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart Card */}
        <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <div className="p-0">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <h3 className="text-xl font-bold text-white">Status Distribution</h3>
              <p className="text-sm text-blue-100">Bar representation of content status</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                  <YAxis tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                    }} 
                  />
                  <Bar
                    dataKey="value"
                    barSize={40}
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={1500}
                    isAnimationActive={true}
                  >
                    {analyticsData.map((entry, index) => (
                      <Cell
                        key={`bar-cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart Card */}
        <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <div className="p-0">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
              <h3 className="text-xl font-bold text-white">Percentage Breakdown</h3>
              <p className="text-sm text-purple-100">Proportional view of content status</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                <Pie
  data={analyticsData}
  cx="50%"
  cy="50%"
  outerRadius={100}
  innerRadius={60}
  dataKey="value"
  animationBegin={0}
  animationDuration={1500}
  isAnimationActive={true}
  labelLine={false}
  label={({ name, percent }) => {
    // Add more spacing between name and percentage
    return `${name}:   ${(percent * 100).toFixed(0)}%`;  // Added more spaces between the colon and percentage
  }}
>
  {analyticsData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
      stroke="rgba(255,255,255,0.5)"
      strokeWidth={2}
    />
  ))}
</Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                    }} 
                    formatter={(value, name) => [`${value} items (${Math.round(value/total*100)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Key Insights</h3>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={`insight-${index}`} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: insight.color }}></div>
              <p>{insight.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;