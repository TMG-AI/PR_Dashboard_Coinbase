export interface ClientConfig {
  appName: string;
  clientName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  alertThresholds: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  notificationEmails: string[];
}

const config: ClientConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'PR Command Center',
  clientName: process.env.NEXT_PUBLIC_CLIENT_NAME || 'Coinbase',
  logoUrl: 'https://assets.brandfolder.com/3RTK8FAF/at/7q7v7q-7q7v7q/coinbase-logo.svg',
  primaryColor: '#0052FF',
  secondaryColor: '#10182b',
  alertThresholds: {
    critical: 90,
    high: 70,
    medium: 50,
    low: 30,
  },
  notificationEmails: ['pr@coinbase.com'],
};

export default config;
