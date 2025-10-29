import { registerAs } from "@nestjs/config";

interface Service {
  url: string;
  name: string;
}

export interface ServicesConfig {
  auth: Service;
  messages: Service;
  filters: Service;
}
export const servicesConfig = registerAs('services', (): ServicesConfig => {
  const auth: Service = {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:5002/api',
    name: process.env.AUTH_SERVICE_NAME || 'auth-service',
  };

  const messages: Service = {
    url: process.env.MESSAGES_SERVICE_URL || 'http://localhost:5003/api',
    name: process.env.MESSAGES_SERVICE_NAME || 'messages-service',
  };

  const filters: Service = {
    url: process.env.FILTERS_SERVICE_URL || 'http://localhost:5004/api',
    name: process.env.FILTERS_SERVICE_NAME || 'filters-service',
  };

  return {
    auth,
    messages,
    filters,
  };
});
