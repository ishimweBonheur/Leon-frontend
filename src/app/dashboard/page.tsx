"use client";
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Widgets = () => {

  const [datasetType, setDatasetType] = useState<'applications' | 'hired'>('applications');
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    hiredCandidates: 0,
    interviewScheduled: 0
  });

  useEffect(() => {
    const fetchStats = () => {
      setTimeout(() => {
        setStats({
          totalJobs: 24,
          totalApplications: 156,
          hiredCandidates: 12,
          interviewScheduled: 18
        });
      }, 500);
    };

    fetchStats();
  }, []);

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    applications: [30, 40, 45, 50, 70, 90],
    hired: [5, 10, 15, 20, 25, 30]
  };

  const quarterlyData = {
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
    applications: [115, 145, 130, 180],
    hired: [30, 45, 40, 55]
  };

  const currentData = timeRange === 'monthly' ? monthlyData : quarterlyData;

  const lineChartData = {
    labels: currentData.labels,
    datasets: [
      {
        label: datasetType === 'applications' ? 'Job Applications' : 'Hired Candidates',
        data: datasetType === 'applications' ? currentData.applications : currentData.hired,
        fill: false,
        borderColor: datasetType === 'applications' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: datasetType === 'applications' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };

  const statusData = {
    labels: ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected'],
    datasets: [
      {
        label: 'Candidates',
        data: [156, 45, 22, 12, 77],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const conversionRate = stats.totalApplications > 0
    ? ((stats.hiredCandidates / stats.totalApplications) * 100).toFixed(1)
    : '0';

  return (
    <section>
      <div className="p-6 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-primary dark:text-white text-white' : 'dark:text-black text-black bg-gray-200'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'analytics' ? 'bg-primary dark:text-white text-white' : ' dark:text-black text-black bg-gray-200'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className=" p-5 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-primary">
            <h3 className=" dark:text-gray-300 text-black text-sm font-medium">Total Jobs</h3>
            <p className="text-2xl font-bold dark:text-gray-300 text-black">{stats.totalJobs}</p>
            <p className="dark:text-gray-300 text-black text-xs">Updated: April 2025</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-yellow-500">
            <h3 className="dark:text-gray-300 text-black text-sm font-medium">Total Applications</h3>
            <p className="text-2xl dark:text-gray-300 text-black font-bold">{stats.totalApplications}</p>
            <p className="dark:text-gray-300 text-black text-xs">Compared to last month: +20%</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-purple-500">
            <h3 className="dark:text-gray-300 text-black text-sm font-medium">Hired Candidates</h3>
            <p className="text-2xl dark:text-gray-300 text-black font-bold">{stats.hiredCandidates}</p>
            <p className="dark:text-gray-300 text-black text-xs">Goal: 20 hires</p>
          </div>
          <div className=" bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-yellow-500">
            <h3 className="dark:text-gray-300 text-black text-sm font-medium">Conversion Rate</h3>
            <p className="text-2xl dark:text-gray-300 text-black font-bold">{conversionRate}%</p>
            <p className="dark:text-gray-300 text-black text-xs">From application to hire</p>
          </div>
        </div>

        {activeTab === 'overview' ? (
          <>

            <div className="bg-white dark:bg-gray-900  p-5 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center dark:text-gray-300 text-black mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {datasetType === 'applications' ? 'Applications' : 'Hires'} Over Time
                </h3>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded ${timeRange === 'monthly' ? 'bg-primary dark:text-white text-white' : 'dark:text-black text-black bg-gray-200'}`}
                    onClick={() => setTimeRange('monthly')}
                  >
                    Monthly
                  </button>
                  <button
                    className={`px-3 py-1 rounded ${timeRange === 'quarterly' ? 'bg-primary dark:text-white text-white' : 'dark:text-black text-black bg-gray-200'}`}
                    onClick={() => setTimeRange('quarterly')}
                  >
                    Quarterly
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 dark:text-black text-black "
                    onClick={() => setDatasetType(datasetType === 'applications' ? 'hired' : 'applications')}
                  >
                    Toggle View
                  </button>
                </div>
              </div>
              <div className="h-80">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold dark:text-gray-300 text-black mb-4">Recent Activity</h3>
              <div className="space-y-4 dark:text-gray-300 text-black">
                {[{ id: 1, title: 'Job Posted', timestamp: '2 hours ago' }, { id: 2, title: 'Candidate Hired', timestamp: '1 day ago' }].map(item => (
                  <div key={item.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="bg-primary p-2 rounded-full mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium dark:text-gray-300 text-black">{item.title}</h4>
                      <p className="text-xs text-gray-500">{item.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
          
            <h3 className="text-lg dark:text-gray-300 text-black font-semibold text-gray-800 mb-4">Status Breakdown</h3>
            <div className="h-80 dark:text-gray-300 text-black">
              <Bar data={statusData} options={chartOptions} />
            </div>

          </>
        )}

      </div>
    </section>
  );
};

export default Widgets;
