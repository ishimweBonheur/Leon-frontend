// types/useJobs.ts

import { Job } from './job';

export interface UseJobs {
  jobs: Job[];
  loading: boolean;
  addJob: (newJob: Job) => void;
  updateJob: (updatedJob: Job) => void;
  deleteJob: (id: number) => void;
}
