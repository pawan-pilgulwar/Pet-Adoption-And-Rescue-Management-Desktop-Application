export type { Report, RescueRequest } from '../../types';

// Payload for creating a report (uses nested pet_data per ReportCreateSerializer)
export interface CreateReportPayload {
  report_type: 'Lost' | 'Found';
  location: string;
  description?: string;
  pet_data: {
    name: string;
    species: string;
    breed?: string;
    color?: string;
    age?: number;
    gender?: string;
    size?: string;
    image_url?: string;
    image_public_id?: string;
  };
}
