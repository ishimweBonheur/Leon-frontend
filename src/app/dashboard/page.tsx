'use client';

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
  const [datasetType, setDatasetType] = useState<'applications' | 'Accepted'>('applications');
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  
  const [statusCounts, setStatusCounts] = useState({ applied: 0, Shortlisted: 0, Accepted: 0, Rejected: 0 });

  const { jobs = [], loading: jobsLoading, refetch: fetchJobs } = useJobs();
  const {
    applications = [],
    loading: applicationsLoading,
    refetch: fetchApplications,
    getAllApplications,
  } = useJobApplication();

  useEffect(() => {
    fetchJobs?.();
    getAllApplications?.();
  }, []);

  useEffect(() => {
    if (activeTab === 'overview' || activeTab === 'analytics') {
      fetchJobs?.();
      getAllApplications?.();
    }
  }, [activeTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchJobs?.();
      getAllApplications?.();
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const Accepted = applications.filter(app => app.status === 'Accepted').length;
    const Shortlisted = applications.filter(app => app.status === 'Shortlisted').length;
    const Rejected = applications.filter(app => app.status === 'Rejected').length;
    const applied = applications.length - Accepted - Shortlisted - Rejected;

    setStatusCounts({ applied, Shortlisted, Accepted, Rejected });
  }, [applications]);

  const prepareChartData = (range: 'monthly' | 'quarterly') => {
    const result = { labels: [] as string[], applications: [] as number[], Accepted: [] as number[] };
    const now = new Date();

    if (range === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        result.labels.push(date.toLocaleString('default', { month: 'short' }));
        const filtered = applications.filter(app => {
          const appDate = app?.createdAt ? new Date(app.createdAt) : null;
          return appDate && appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
        });
        result.applications.push(filtered.length);
        result.Accepted.push(filtered.filter(app => app.status === 'Accepted').length);
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
          const appDate = app?.createdAt ? new Date(app.createdAt) : null;
          return appDate && Math.floor(appDate.getMonth() / 3) === quarter && appDate.getFullYear() === year;
        });
        result.applications.push(filtered.length);
        result.Accepted.push(filtered.filter(app => app.status === 'Accepted').length);
      }
    }
    return result;
  };

  const chartData = useMemo(() => prepareChartData(timeRange), [applications, timeRange]);

  const acceptedCandidates = applications.filter(app =>
    ['Accepted', 'Shortlisted'].includes(app.status)
  ).length;

  const conversionRate = applications.length > 0
    ? ((statusCounts.Accepted / applications.length) * 100).toFixed(1)
    : '0';

  const BlobBackground = () => (
    <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-5">
      <svg
        viewBox="0 0 800 800"
        className="absolute -left-20 -top-40 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#3B82F6"
          d="M717.5 492.5c-33.5 44.5-86.5 85-142 99.5-55.5 14.5-113.5 2.5-158-27-44.5-29.5-75.5-77.5-117-92s-97 1.5-132.5 25.5-63 66-75 117.5c-12 51.5-2 117.5-33.5 148s-109.5 16.5-140-24.5-21.5-117 5-171.5 58.5-99.5 108-129 103.5-50.5 148-58 91 7.5 126 41.5 59.5 87.5 93 132z"
        />
      </svg>
      <svg
        viewBox="0 0 800 800"
        className="absolute -right-20 -bottom-40 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#10B981"
          d="M717.5 492.5c-33.5 44.5-86.5 85-142 99.5-55.5 14.5-113.5 2.5-158-27-44.5-29.5-75.5-77.5-117-92s-97 1.5-132.5 25.5-63 66-75 117.5c-12 51.5-2 117.5-33.5 148s-109.5 16.5-140-24.5-21.5-117 5-171.5 58.5-99.5 108-129 103.5-50.5 148-58 91 7.5 126 41.5 59.5 87.5 93 132z"
        />
      </svg>
    </div>
  );



  return (
    <section className=" w-full  sm:p-4 md:p-6 relative overflow-hidden min-h-screen ">
      <BlobBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track and analyze process metrics
          </p>
        </div>

        <div className="flex justify-between mb-6 flex-wrap gap-y-4">
          <div className="flex space-x-2">
            {(['overview', 'analytics'] as const).map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm md:text-base rounded-lg transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
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
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-8">
              {[
                { title: 'Total Jobs', value: jobs.length, color: 'bg-blue-500', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>  
                )},
                { title: 'Total Applications', value: applications.length, color: 'bg-yellow', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )},
                { title: 'Accepted Candidates', value: acceptedCandidates, color: 'bg-purple-500', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )},
                { title: 'Conversion Rate', value: `${conversionRate}%`, color: 'bg-green-500', icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )},
              ].map((stat, i) => (
                <div key={i} className={`p-5 rounded-xl shadow-sm backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full ${stat.color} opacity-10`}></div>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${stat.color} text-white shadow-md`}>
                      {stat.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</h3>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeTab === 'overview' ? (
              <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                    {datasetType === 'applications' ? 'Applications' : 'Hires'} Over Time
                  </h3>
                  <div className="flex space-x-2">
                    {(['monthly', 'quarterly'] as const).map(range => (
                      <button
                        key={range}
                        className={`px-3 py-1 text-xs md:text-sm rounded-lg transition-all ${
                          timeRange === range
                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setTimeRange(range)}
                      >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 text-xs md:text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all"
                      onClick={() =>
                        setDatasetType(prev => (prev === 'applications' ? 'Accepted' : 'applications'))
                      }
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
                          label: datasetType === 'applications' ? 'Job Applications' : 'Accepted Candidates',
                          data: datasetType === 'applications' ? chartData.applications : chartData.Accepted,
                          fill: true,
                          backgroundColor: datasetType === 'applications' 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'rgba(16, 185, 129, 0.1)',
                          borderColor: datasetType === 'applications' 
                            ? 'rgba(59, 130, 246, 1)' 
                            : 'rgba(16, 185, 129, 1)',
                          borderWidth: 2,
                          tension: 0.4,
                          pointBackgroundColor: '#fff',
                          pointBorderColor: datasetType === 'applications' 
                            ? 'rgba(59, 130, 246, 1)' 
                            : 'rgba(16, 185, 129, 1)',
                          pointBorderWidth: 2,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: '#6B7280',
                            font: {
                              family: 'Inter, sans-serif',
                            },
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderWidth: 1,
                          padding: 12,
                          usePointStyle: true,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            color: 'rgba(229, 231, 235, 0.5)',
                          },
                          ticks: {
                            color: '#6B7280',
                          },
                        },
                        y: {
                          grid: {
                            color: 'rgba(229, 231, 235, 0.5)',
                          },
                          ticks: {
                            color: '#6B7280',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white/70 dark:bg-gray-800/70 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Application Status Breakdown</h3>
                <div className="h-60 sm:h-72 md:h-80">
                  <Bar
                    data={{
                      labels: ['Applied', 'Shortlisted', 'Accepted', 'Rejected'],
                      datasets: [
                        {
                          label: 'Candidates',
                          data: Object.values(statusCounts),
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(239, 68, 68, 0.7)',
                          ],
                          borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(245, 158, 11, 1)',
                            'rgba(16, 185, 129, 1)',
                            'rgba(239, 68, 68, 1)',
                          ],
                          borderWidth: 1,
                          borderRadius: 6,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: '#6B7280',
                            font: {
                              family: 'Inter, sans-serif',
                            },
                            usePointStyle: true,
                          },
                        },
                        tooltip: {
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          titleColor: '#fff',
                          bodyColor: '#fff',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          borderWidth: 1,
                          padding: 12,
                          usePointStyle: true,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            color: 'rgba(229, 231, 235, 0.5)',
                          },
                          ticks: {
                            color: '#6B7280',
                          },
                        },
                        y: {
                          grid: {
                            color: 'rgba(229, 231, 235, 0.5)',
                          },
                          ticks: {
                            color: '#6B7280',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;