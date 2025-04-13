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

const dashboard = () => {
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
    }, 30000);

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
    </section>
  );
};

export default dashboard;
