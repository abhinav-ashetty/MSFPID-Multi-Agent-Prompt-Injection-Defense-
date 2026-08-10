import { HealthStatus } from '../components/HealthStatus';

/**
 * AIShield home page.
 * Displays project title, description, and backend connection status.
 */
export function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        {/* Logo / Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 text-white text-3xl font-bold mb-6">
            🛡️
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          AIShield
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          A multi-agent AI security system demonstrating how a Defender Agent
          can detect, evaluate, and prevent attacks before they reach the Target Agent.
        </p>

        {/* Architecture Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Architecture</h2>
          <div className="space-y-3 font-mono text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">Attacker Agent</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-green-600 font-medium">Defender Agent</span>
              <span className="text-gray-400">→</span>
            </div>
            <div className="flex items-center gap-2 ml-8">
              <span className="text-gray-600">Target Agent</span>
            </div>
            <div className="flex items-center gap-2 ml-8 mt-2">
              <span className="text-gray-600">Output Leakage Detector</span>
            </div>
            <div className="flex items-center gap-2 ml-8 mt-2">
              <span className="text-gray-600">User</span>
            </div>
          </div>
        </div>

        {/* Backend Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>
          <HealthStatus />
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Phase 1: Project Foundation</p>
          <p className="mt-1">Backend: FastAPI · Frontend: React + TypeScript + Tailwind</p>
        </div>
      </div>
    </main>
  );
}