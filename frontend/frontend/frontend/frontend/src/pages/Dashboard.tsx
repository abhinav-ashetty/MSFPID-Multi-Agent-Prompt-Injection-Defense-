import { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Repeat, XCircle } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { securityApi } from '../services/api';
import { StatisticsResponse } from '../types/security';
import { StatCard } from '../components/dashboard/StatCard';
import { SecurityTimeline } from '../components/dashboard/SecurityTimeline';
import { AttackCategories } from '../components/dashboard/AttackCategories';
import { RiskDistribution } from '../components/dashboard/RiskDistribution';
import { RecentAssessments } from '../components/dashboard/RecentAssessments';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

/**
 * Dashboard page showing security analytics.
 */
export const Dashboard = () => {
  const [stats, setStats] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await securityApi.getStatistics();
        setStats(statsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard statistics:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingState />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
          <ErrorState 
            message={error} 
            onRetry={() => {
              setLoading(true);
              setError(null);
            }}
          />
        </main>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
          <EmptyState
            title="No data available"
            description="No security data to display. Start by analyzing a prompt to generate data."
            actionText="Analyze Prompt"
            onAction={() => {
              window.location.href = '/analyze';
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Prompts"
            value={stats.total_assessments}
            icon={ShieldCheck}
            variant="blue"
          />
          <StatCard
            title="Allowed"
            value={stats.decisions.ALLOW}
            icon={CheckCircle}
            variant="green"
          />
          <StatCard
            title="Sanitized"
            value={stats.decisions.SANITIZE}
            icon={Repeat}
            variant="yellow"
          />
          <StatCard
            title="Blocked"
            value={stats.decisions.BLOCK}
            icon={XCircle}
            variant="red"
          />
        </div>

        {/* Charts and tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Timeline */}
          <SecurityTimeline />
          
          {/* Attack Categories and Risk Distribution */}
          <div className="space-y-6">
            <AttackCategories />
            <RiskDistribution />
          </div>
          
          {/* Recent Assessments */}
          <RecentAssessments />
        </div>
      </main>
    </div>
  );
};
