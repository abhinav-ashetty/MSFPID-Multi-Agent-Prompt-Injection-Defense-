import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { securityApi } from '../services/api';
import { SecurityAnalysisResponse } from '../types/security';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { HealthStatus } from '../components/HealthStatus';

/**
 * Prompt analysis page.
 */
export const Analyze = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<SecurityAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await securityApi.analyzePrompt({ prompt });
      setResult(response);
    } catch (err) {
      console.error('Failed to analyze prompt:', err);
      setError('Failed to analyze prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionClass = (decision: string) => {
    switch (decision) {
      case 'ALLOW': return 'bg-green-100 text-green-800';
      case 'SANITIZE': return 'bg-yellow-100 text-yellow-800';
      case 'BLOCK': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 pt-16">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter prompt to analyze
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
              placeholder="Type or paste the prompt you want to analyze for security threats..."
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Analyzing...' : 'Analyze Prompt'}
              </button>
            </div>
          </div>
        </form>

        {/* Result */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Result</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2>Decision</h3>
                <p className={`${getDecisionClass(result.decision)} text-lg font-bold`}>
                  {result.decision}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2>Final Risk Score</h3>
                <p className="text-lg font-bold text-gray-900>{result.final_risk_score}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className={`h-2.5 rounded-full 
                      ${result.final_risk_score >= 70 ? 'bg-red-500' 
                        : result.final_risk_score >= 40 ? 'bg-yellow-500' 
                        : 'bg-green-500'}` 
                    style={{ width: `${result.final_risk_score}%` }}
                  />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2>Confidence</h3>
                <p className="text-lg font-bold text-gray-900>
                  {(result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2>Score Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1>Rule Score</p>
                  <p className="text-lg font-bold text-gray-900>{result.rule_score}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1>ML Probability</p>
                  <p className="text-lg font-bold text-gray-900>
                    {(result.ml_probability * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1>Gemini Risk Score</p>
                  <p className="text-lg font-bold text-gray-900>{result.gemini_risk_score}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1>Attack Type</p>
                  <p className="text-lg font-bold text-gray-900>{result.attack_type}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2>Reason</h3>
              <p className="text-gray-700>{result.reason}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
