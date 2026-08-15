import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { securityApi } from '../services/api';
import { AssessmentsResponse, AssessmentItem } from '../types/security';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { HealthStatus } from '../components/HealthStatus';

/**
 * Assessments history page.
 */
export const Assessments = () => {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await securityApi.getAssessments(limit, offset);
        setAssessments(prev => [...prev, ...response.items]);
        setTotal(response.total);
        setHasMore(response.items.length === limit); // Assume more if we got a full page
        setError(null);
      } catch (err) {
        console.error('Failed to fetch assessments:', err);
        setError('Failed to load assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, offset]);

  const loadMore = () => {
    setOffset(prev => prev + limit);
  };

  if (loading && assessments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
          <LoadingState />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
          <ErrorState message={error} onRetry={() => { 
            setOffset(0);
            setAssessments([]);
            setTotal(0);
            setHasMore(true);
            /* trigger refetch */ 
          }} />
        </main>
      </div>
    );
  }

  if (assessments.length === 0 && total === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
          <EmptyState
            title="No assessments yet"
            description="No security assessments have been recorded. Start by analyzing a prompt."
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
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Showing {Math.min(offset + assessments.length, total)} of {total} assessments
          </p>
        </div>

        {assessments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID</th>
                    <th scope="col" className="px-4 py-3">Time</th>
                    <th scope="col" className="px-4 py-3">Risk</th>
                    <th scope="col" className="px-4 py-3">Decision</th>
                    <th scope="col" className="px-4 py-3">Attack Type</th>
                    <th scope="col" className="px-4 py-3">Confidence</th>
                    <th scope="col" className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs font-medium">{item.id}</td>
                      <td className="px-4 py-3">
                        <time dateTime={item.timestamp}>
                          {new Date(item.timestamp).toLocaleString()}
                        </time>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div 
                            className={`w-2 h-2 rounded-full 
                              ${item.final_risk_score >= 70 ? 'bg-red-500' 
                                : item.final_risk_score >= 40 ? 'bg-yellow-500' 
                                : 'bg-green-500'}`}
                          />
                          <span className="ml-2 text-xs font-medium">{item.final_risk_score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span 
                          className={`px-2 py-1 text-xs font-semibold 
                            ${item.decision === 'ALLOW' ? 'bg-green-100 text-green-800' 
                              : item.decision === 'SANITIZE' ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'}`}
                        >
                          {item.decision}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs">{item.attack_type}</span>
                      </td>
                      <td className="px-4 py-3>
                        <span className="text-xs font-medium">
                          {(item.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3>
                        <p className="text-xs line-clamp-2">{item.reason}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {hasMore && (
          <div className="mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Load More Assessments
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
