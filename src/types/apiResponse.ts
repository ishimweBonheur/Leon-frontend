// types/ApiResponse.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
// types/JobApiResponse.ts

import { Job } from './job';

export interface JobApiResponse extends ApiResponse<Job[]> {}
