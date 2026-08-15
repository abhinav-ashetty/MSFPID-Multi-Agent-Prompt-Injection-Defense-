import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { securityApi } from '../services/api';
import { SecurityAnalysisResponse } from '../types/security';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { HealthStatus } from '../components/HealthStatus';

/**
 * Assessment details page.
 */
export const AssessmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<SecurityAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/assessments');
        return;
      }

      try {
        setLoading(true);
        const response = await securityApi.getAssessment(parseInt(id));
        setAssessment(response);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch assessment details:', err);
        if (err.response && err.response.status === 404) {
          setError('Assessment not found');
        } else {
          setError('Failed to load assessment details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
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

  if (!assessment) {
    return <LoadingState />;
  }

  // Helper function to get decision class
  const getDecisionClass = (decision: string) => {
    if (decision === 'ALLOW') return 'bg-green-100 text-green-800';
    if (decision === 'SANITIZE') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Helper function to get risk score color class
  const getRiskScoreClass = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Assessment #{assessment.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(assessment.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span 
                  className={`px-2 py-1 text-xs font-semibold ${getDecisionClass(assessment.decision)}`}
                >
                  {assessment.decision}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2>Analyzed Prompt</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded">{assessment.prompt}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2>Final Risk Score</h3>
                <p className="text-lg font-bold text-gray-900>{assessment.final_risk_score}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className={`h-2.5 rounded-full ${getRiskScoreClass(assessment.final_risk_score)}`} 
                    style={{ width: `${assessment.final_risk_score}%` }}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2>Rule Score</h3>
                <p className="text-lg font-bold text-gray-900>{assessment.rule_score}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2>ML Probability</h3>
                <p className="text-lg font-bold text-gray-900>
                  {(assessment.ml_probability * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2>Gemini Risk Score</h3>
                <p className="text-lg font-bold text-gray-900>{assessment.gemini_risk_score}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2>Attack Type</h3>
                <p className="text-lg font-bold text-gray-900>{assessment.attack_type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2>Confidence</h3>
                <p className="text-lg font-bold text-gray-900>
                  {(assessment.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2>Reason</h3>
              <p className="text-gray-700>{assessment.reason}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
