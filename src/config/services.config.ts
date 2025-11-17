import { registerAs } from '@nestjs/config';

interface Service {
  url: string;
  name: string;
  paths?: string[];
}

export interface ServicesConfig {
  auth: Service;
  conversations: Service;
  filter: Service;
  integration: Service;
  metrics: Service;
  llm: Service;
}
export const servicesConfig = registerAs('services', (): ServicesConfig => {
  const auth: Service = {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
    name: process.env.AUTH_SERVICE_NAME || 'auth-service',
    paths: ['/api/auth', '/api/users'],
  };

  const conversations: Service = {
    url: process.env.CONVERSATIONS_SERVICE_URL || 'http://localhost:5001',
    name: process.env.CONVERSATIONS_SERVICE_NAME || 'conversations-service',
    paths: ['/api/conversations'],
  };

  const filter: Service = {
    url: process.env.FILTERS_SERVICE_URL || 'http://localhost:5002',
    name: process.env.FILTERS_SERVICE_NAME || 'filter-service',
  };

  const integration: Service = {
    url: process.env.INTEGRATIONS_SERVICE_URL || 'http://localhost:5003',
    name: process.env.INTEGRATIONS_SERVICE_NAME || 'integration-service',
    paths: ['/api/external-systems'],
  };

  const metrics: Service = {
    url: process.env.METRICS_SERVICE_URL || 'http://localhost:5004',
    name: process.env.METRICS_SERVICE_NAME || 'metrics-service',
  };

  const llm: Service = {
    url: process.env.LLM_SERVICE_URL || 'http://localhost:5005',
    name: process.env.LLM_SERVICE_NAME || 'llm-service',
  };

  return {
    auth,
    conversations,
    filter,
    integration,
    metrics,
    llm,
  };
});
