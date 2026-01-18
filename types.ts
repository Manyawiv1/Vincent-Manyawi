
export enum EntityType {
  FARM = 'FARM',
  DISTRIBUTION = 'DISTRIBUTION'
}

export interface Entity {
  id: string;
  name: string;
  country: string;
  type: EntityType;
}

export interface WeeklyData {
  entityId: string;
  status: 'green' | 'amber' | 'red';
  kpis: {
    revenue: number;
    revenueTarget: number;
    // Farm Specific
    production?: number;
    productionTarget?: number;
    fcr?: number;
    mortality?: number;
    // Distribution Specific
    salesVolume?: number;
    salesTarget?: number;
    newCustomers?: number;
    fulfillmentRate?: number;
  };
  operational: {
    win: string;
    challenge: string;
  };
}

export interface CashflowData {
  opening: number;
  cashIn: number;
  cashOut: number;
  closing: number;
  receivables30: number;
  receivables60: number;
}

export interface Newsletter {
  weekNumber: number;
  year: number;
  weekEnding: string;
  executiveSummary: string;
  data: WeeklyData[];
  cashflow: CashflowData;
  priorities: string[];
  supportRequired: string[];
  esms: {
    environmental: string[];
    social: string[];
    compliance: string[];
  };
}
