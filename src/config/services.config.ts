import { registerAs } from "@nestjs/config";

interface Service {
  url: string;
  name: string;
  paths?: string[];
}

export interface ServicesConfig {
  auth: Service;
  message: Service;
  filter: Service;
  integration: Service;
}
export const servicesConfig = registerAs('services', (): ServicesConfig => {
  const auth: Service = {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
    name: process.env.AUTH_SERVICE_NAME || 'auth-service',
    paths: ['/api/auth', '/api/users'],
  };

  const message: Service = {
    url: process.env.MESSAGES_SERVICE_URL || 'http://localhost:5001',
    name: process.env.MESSAGES_SERVICE_NAME || 'message-service',
    paths: ['/api/messages', '/api/conversations'],
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

  return {
    auth,
    message,
    filter,
    integration,
  };
});
