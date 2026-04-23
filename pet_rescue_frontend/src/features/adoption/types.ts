// Adoption feature local types (re-exports from shared types + any local ones)
export type { AdoptionListing, AdoptionRequest, Adoption } from '../../types';

// Payload for creating an adoption request
export interface CreateAdoptionRequestPayload {
  pet: number;
  listing?: number;
  request_details?: string;
}

// Payload for creating a listing
export interface CreateListingPayload {
  pet: number;
  price: string;
  description?: string;
}
