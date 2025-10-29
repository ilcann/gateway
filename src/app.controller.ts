import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { Response } from 'express';
import { ServicesConfig } from './config/services.config';

@Controller('')
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get('')
  async getRoot(@Res() res: Response) {
    const appConfig = this.configService.get('app');
    const servicesConfig = this.configService.get<ServicesConfig>('services');

    // Servislerin durumunu kontrol et
    const serviceStatuses = await Promise.all(
      Object.values(servicesConfig || {}).map(async (service) => {
        try {
          const response = await axios.get(`${service.url}/status`, { timeout: 2000 });
          return { name: service.name, url: service.url, status: response.status === 200 ? 'Online' : 'Offline' };
        } catch {
          return { name: service.name, url: service.url, status: 'Offline' };
        }
      })
    );

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Gateway Status</title>
          <style>
            body { font-family: sans-serif; margin: 2rem; }
            h1 { color: #333; }
            pre { background: #f4f4f4; padding: 1rem; }
            table { border-collapse: collapse; margin-top: 1rem; }
            th, td { border: 1px solid #ccc; padding: 0.5rem 1rem; }
            th { background: #eee; }
          </style>
        </head>
        <body>
          <h1>Gateway is running ✅</h1>
          <h2>App Config:</h2>
          <pre>${JSON.stringify(appConfig, null, 2)}</pre>
          <h2>Service Statuses:</h2>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${serviceStatuses.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.url}</td>
                  <td>${s.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    res.type('html').send(html);
  }
}
