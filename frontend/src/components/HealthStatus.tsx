import { useEffect, useState } from 'react';
import { healthApi } from '../services/api';

/** Possible backend connection states. */
type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

interface HealthStatusProps {
  /** Optional custom class names. */
  className?: string;
}

/**
 * Displays the backend connection status.
 * Automatically checks the health endpoint on mount.
 */
export function HealthStatus({ className = '' }: HealthStatusProps) {
  const [status, setStatus] = useState<ConnectionStatus>('checking');

  useEffect(() => {
    let isMounted = true;

    const checkHealth = async () => {
      try {
        const response = await healthApi.check();
        if (isMounted) {
          setStatus(response.status === 'ok' ? 'connected' : 'disconnected');
        }
      } catch {
        if (isMounted) {
          setStatus('disconnected');
        }
      }
    };

    checkHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  const statusConfig = {
    checking: {
      text: 'Checking...',
      color: 'text-yellow-600 bg-yellow-100',
      icon: '⏳',
    },
    connected: {
      text: 'Backend Status: Connected',
      color: 'text-green-700 bg-green-100',
      icon: '✅',
    },
    disconnected: {
      text: 'Backend Status: Disconnected',
      color: 'text-red-700 bg-red-100',
      icon: '❌',
    },
  };

  const { text, color, icon } = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm ${color} ${className}`}>
      <span aria-hidden="true">{icon}</span>
      <span>{text}</span>
    </div>
  );
}