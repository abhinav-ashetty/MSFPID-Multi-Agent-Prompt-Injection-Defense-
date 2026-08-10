/** Health check response from the backend API. */
export interface HealthResponse {
  /** Status of the backend service, typically "ok" when healthy. */
  status: string;
}