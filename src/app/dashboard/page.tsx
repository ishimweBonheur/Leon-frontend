"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { useJobs } from '@/Hooks/jobs';
import { useJobApplication } from '@/Hooks/applications';
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
  ArcElement,
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

const Dashboard = () => {
  const [datasetType, setDatasetType] = useState<'applications' | 'hired'>('applications');
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [statusCounts, setStatusCounts] = useState({ applied: 0, interview: 0, offer: 0, hired: 0, rejected: 0 });

  const { jobs = [], loading: jobsLoading, refetch: fetchJobs } = useJobs();
  const {
    applications = [],
    loading: applicationsLoading,
    refetch: fetchApplications,
    getAllApplications,
  } = useJobApplication();

  // Fetch data once on mount
  useEffect(() => {
    fetchJobs?.();
    getAllApplications?.();
  }, []);

  // Refetch when active tab changes
  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'analytics') {
      fetchJobs?.();
      getAllApplications?.();
    }
  }, [activeTab]);

  // Auto-refresh every 30 seconds (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchJobs?.();
      getAllApplications?.();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Compute status counts
  useEffect(() => {
    const hired = applications.filter(app => app.status === 'hired').length;
    const interview = applications.filter(app => app.status === 'interview').length;
    const offer = applications.filter(app => app.status === 'offer').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const applied = applications.length - hired - interview - offer - rejected;

    setStatusCounts({ applied, interview, offer, hired, rejected });
  }, [applications]);

  const prepareChartData = (range: 'monthly' | 'quarterly') => {
    const result = { labels: [] as string[], applications: [] as number[], hired: [] as number[] };
    const now = new Date();

    if (range === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        result.labels.push(date.toLocaleString('default', { month: 'short' }));
        const filtered = applications.filter(app => {
          if (!app?.createdAt) return false;
          const appDate = new Date(app.createdAt);
          return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
        });
        result.applications.push(filtered.length);
        result.hired.push(filtered.filter(app => app.status === 'hired').length);
      }
    } else {
      for (let i = 3; i >= 0; i--) {
        let quarter = Math.floor(now.getMonth() / 3) - i;
        let year = now.getFullYear();
        if (quarter < 0) {
          quarter += 4;
          year -= 1;
        }
        result.labels.push(`Q${quarter + 1} ${year}`);
        const filtered = applications.filter(app => {
          if (!app?.createdAt) return false;
          const appDate = new Date(app.createdAt);
          return Math.floor(appDate.getMonth() / 3) === quarter && appDate.getFullYear() === year;
        });
        result.applications.push(filtered.length);
        result.hired.push(filtered.filter(app => app.status === 'hired').length);
      }
    }
    return result;
  };

  const chartData = useMemo(() => prepareChartData(timeRange), [applications, timeRange]);
  const conversionRate = applications.length > 0
    ? ((statusCounts.hired / applications.length) * 100).toFixed(1)
    : '0';

  return (
    <section className="w-full max-w-full p-2 sm:p-4 md:p-6">
      {/* Tabs */}
      <div className="flex justify-between mb-6 flex-wrap gap-y-4">
        <div className="flex space-x-2">
          {(['overview', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              className={`px-3 py-2 text-sm md:text-base rounded-lg ${activeTab === tab ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {(jobsLoading || applicationsLoading) ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 text-black dark:text-white">
            {[
              { title: 'Total Jobs', value: jobs.length, border: 'border-primary' },
              { title: 'Total Applications', value: applications.length, border: 'border-yellow-500' },
              { title: 'Hired Candidates', value: statusCounts.hired, border: 'border-purple-500' },
              { title: 'Conversion Rate', value: `${conversionRate}%`, border: 'border-yellow-500' },
            ].map((stat, i) => (
              <div key={i} className={`p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border-l-4 ${stat.border}`}>
                <h3 className="text-sm font-medium">{stat.title}</h3>
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          {activeTab === 'overview' ? (
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mb-6">
              <div className="flex justify-between mb-4">
                <h3 className="text-base md:text-lg text-black dark:text-white font-semibold">{datasetType === 'applications' ? 'Applications' : 'Hires'} Over Time</h3>
                <div className="flex space-x-2">
                  {['monthly', 'quarterly'].map(range => (
                    <button
                      key={range}
                      className={`px-2 py-1 text-xs md:text-sm rounded ${timeRange === range ? 'bg-primary text-white' : 'bg-gray-200 text-black'}`}
                      onClick={() => setTimeRange(range as 'monthly' | 'quarterly')}
                    >
                      {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                  ))}
                  <button
                    className="px-2 py-1 text-xs md:text-sm bg-gray-200 rounded hover:bg-gray-300 text-black"
                    onClick={() => setDatasetType(datasetType === 'applications' ? 'hired' : 'applications')}
                  >
                    Toggle View
                  </button>
                </div>
              </div>
              <div className="h-60 sm:h-72 md:h-80">
                <Line
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: datasetType === 'applications' ? 'Job Applications' : 'Hired Candidates',
                        data: datasetType === 'applications' ? chartData.applications : chartData.hired,
                        fill: false,
                        borderColor: datasetType === 'applications' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
                        backgroundColor: datasetType === 'applications' ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
                        tension: 0.4,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
              <h3 className="text-base md:text-lg font-semibold mb-4">Status Breakdown</h3>
              <div className="h-60 sm:h-72 md:h-80">
                <Bar
                  data={{
                    labels: ['Applied', 'Interview', 'Offer', 'Hired', 'Rejected'],
                    datasets: [
                      {
                        label: 'Candidates',
                        data: Object.values(statusCounts),
                        backgroundColor: [
                          'rgba(54, 162, 235, 0.6)',
                          'rgba(255, 206, 86, 0.6)',
                          'rgba(153, 102, 255, 0.6)',
                          'rgba(75, 192, 192, 0.6)',
                          'rgba(255, 99, 132, 0.6)',
                        ],
                        borderColor: [
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(255, 99, 132, 1)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          )}
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
    </section>
  );
};

export default Dashboard;
