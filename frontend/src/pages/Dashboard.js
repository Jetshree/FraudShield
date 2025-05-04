import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle, 
  ArrowRight, 
  Filter
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [timeframe, setTimeframe] = useState('week');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Make parallel API calls for better performance
        const [summaryResponse, alertsResponse, transactionsResponse, statsResponse] = await Promise.all([
          dashboardAPI.getSummary(),
          dashboardAPI.getRecentAlerts(),
          dashboardAPI.getRecentTransactions(),
          dashboardAPI.getStats()
        ]);
        
        setSummaryData(summaryResponse.data);
        setRecentAlerts(alertsResponse.data);
        setRecentTransactions(transactionsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Mock chart data while we wait for real data
  const transactionChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Transactions',
        data: [120, 132, 101, 134, 90, 40, 80],
        fill: false,
        borderColor: '#22A8AD',
        tension: 0.3
      },
      {
        label: 'Flagged',
        data: [12, 19, 8, 15, 10, 5, 8],
        fill: false,
        borderColor: '#E84855',
        tension: 0.3
      }
    ]
  };
  
  const riskDistributionData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [15, 35, 50],
        backgroundColor: ['#E84855', '#F4C95D', '#58A4B0'],
        borderWidth: 0
      }
    ]
  };
  
  const fraudTypesData = {
    labels: ['Identity Theft', 'Account Takeover', 'Payment Fraud', 'Promotion Abuse', 'Other'],
    datasets: [
      {
        label: 'Fraud Types',
        data: [32, 25, 20, 15, 8],
        backgroundColor: ['#0A2463', '#3E92CC', '#22A8AD', '#58A4B0', '#7096B0'],
      }
    ]
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <span className="text-sm text-neutral-600">Time period:</span>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input !py-1 !w-auto"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm">Total Transactions</p>
              <h3 className="text-2xl font-bold mt-1">1,258</h3>
              <p className="text-primary-100 text-sm mt-1">
                <span className="text-green-300">↑ 12.5%</span> from last week
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Flagged Transactions</p>
              <h3 className="text-2xl font-bold mt-1">52</h3>
              <p className="text-neutral-500 text-sm mt-1">
                <span className="text-alert-500">↑ 8.2%</span> from last week
              </p>
            </div>
            <div className="bg-alert-100 p-3 rounded-lg text-alert-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Confirmed Fraud</p>
              <h3 className="text-2xl font-bold mt-1">18</h3>
              <p className="text-neutral-500 text-sm mt-1">
                <span className="text-alert-500">↑ 6.7%</span> from last week
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-red-600">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-500 text-sm">Protected Revenue</p>
              <h3 className="text-2xl font-bold mt-1">$12,580</h3>
              <p className="text-neutral-500 text-sm mt-1">
                <span className="text-green-500">↑ 15.3%</span> from last week
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Transactions Overview</h3>
            <button className="btn btn-outline !py-1 !px-3 text-sm flex items-center gap-1">
              <Filter size={14} />
              <span>Filter</span>
            </button>
          </div>
          <div className="h-64">
            <Line 
              data={transactionChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    intersect: false,
                    mode: 'index',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Fraud Types Distribution</h3>
          </div>
          <div className="h-64">
            <Bar 
              data={fraudTypesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Third row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <div className="h-56 flex items-center justify-center">
            <Doughnut 
              data={riskDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                    }
                  }
                },
                cutout: '70%'
              }}
            />
          </div>
        </div>
        
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Alerts</h3>
            <Link to="/alerts" className="text-primary-600 hover:text-primary-800 text-sm flex items-center">
              <span>View all</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {[1, 2, 3, 4].map((item) => (
                  <tr key={item} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">TX-{Math.floor(Math.random() * 1000000)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">${Math.floor(Math.random() * 1000) + 100}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`risk-badge ${
                        item === 1 ? 'risk-high' : item === 2 ? 'risk-medium' : 'risk-low'
                      }`}>
                        {item === 1 ? 'High' : item === 2 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                      {item === 1 ? '2 mins ago' : item === 2 ? '15 mins ago' : item === 3 ? '1 hour ago' : '3 hours ago'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;