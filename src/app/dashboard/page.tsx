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
        <div className="absolute right-0 top-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="450"
            height="556"
            viewBox="0 0 450 556"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="277"
              cy="63"
              r="225"
              fill="url(#paint0_linear_25:217)"
            />
            <circle
              cx="17.9997"
              cy="182"
              r="18"
              fill="url(#paint1_radial_25:217)"
            />
            <circle
              cx="76.9997"
              cy="288"
              r="34"
              fill="url(#paint2_radial_25:217)"
            />
            <circle
              cx="325.486"
              cy="302.87"
              r="180"
              transform="rotate(-37.6852 325.486 302.87)"
              fill="url(#paint3_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="184.521"
              cy="315.521"
              r="132.862"
              transform="rotate(114.874 184.521 315.521)"
              stroke="url(#paint4_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="356"
              cy="290"
              r="179.5"
              transform="rotate(-30 356 290)"
              stroke="url(#paint5_linear_25:217)"
            />
            <circle
              opacity="0.8"
              cx="191.659"
              cy="302.659"
              r="133.362"
              transform="rotate(133.319 191.659 302.659)"
              fill="url(#paint6_linear_25:217)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_25:217"
                x1="-54.5003"
                y1="-178"
                x2="222"
                y2="288"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint1_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <radialGradient
                id="paint2_radial_25:217"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
              >
                <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
              </radialGradient>
              <linearGradient
                id="paint3_linear_25:217"
                x1="226.775"
                y1="-66.1548"
                x2="292.157"
                y2="351.421"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:217"
                x1="184.521"
                y1="182.159"
                x2="184.521"
                y2="448.882"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_25:217"
                x1="356"
                y1="110"
                x2="356"
                y2="470"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_25:217"
                x1="118.524"
                y1="29.2497"
                x2="166.965"
                y2="338.63"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 z-[-1] opacity-30 lg:opacity-100">
          <svg
            width="364"
            height="201"
            viewBox="0 0 364 201"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
              stroke="url(#paint0_linear_25:218)"
            />
            <path
              d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
              stroke="url(#paint1_linear_25:218)"
            />
            <path
              d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
              stroke="url(#paint2_linear_25:218)"
            />
            <path
              d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
              stroke="url(#paint3_linear_25:218)"
            />
            <circle
              opacity="0.8"
              cx="214.505"
              cy="60.5054"
              r="49.7205"
              transform="rotate(-13.421 214.505 60.5054)"
              stroke="url(#paint4_linear_25:218)"
            />
            <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
            <defs>
              <linearGradient
                id="paint0_linear_25:218"
                x1="184.389"
                y1="69.2405"
                x2="184.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_25:218"
                x1="156.389"
                y1="69.2405"
                x2="156.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_25:218"
                x1="125.389"
                y1="69.2405"
                x2="125.389"
                y2="212.24"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_25:218"
                x1="93.8507"
                y1="67.2674"
                x2="89.9278"
                y2="210.214"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" stopOpacity="0" />
                <stop offset="1" stopColor="#4A6CF7" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_25:218"
                x1="214.505"
                y1="10.2849"
                x2="212.684"
                y2="99.5816"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <radialGradient
                id="paint5_radial_25:218"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(220 63) rotate(90) scale(43)"
              >
                <stop offset="0.145833" stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.08" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Widgets;
