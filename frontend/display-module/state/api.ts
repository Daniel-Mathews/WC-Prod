import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ActiveJobs {
  id: number;
  name: string;
  status: string;
}

export interface JobDetails {
  id: number;
  name: string;
  description: string | null;
  deadline: string | null; // Keep as string to match JSON format from backend
  assignee: string | null;
  status: string;
  category: string | null;
}

// Define the type for the data sent when creating a new job.
// This is based on the 'payload' object in your component.
type NewJobPayload = {
  name: string;
  description: string;
  deadline: string | null;
  assignee: string;
  status: string;
  category: string;
};


export const api = createApi({
  baseQuery: fetchBaseQuery(),
  reducerPath: "api",
  tagTypes: ["ActiveJobs", "Job"],
  endpoints: (build) => ({
    getActiveJobs: build.query<ActiveJobs[], string | void>({
      query: (search) => ({
        url: "http://127.0.0.1:8003/dashboard/salesJobs",
        params: search ? { search } : {},
      }),
      providesTags: ["ActiveJobs"],

      transformResponse: (response: { activeJobs: ActiveJobs[] }) => {
        return response.activeJobs;
      },
    }),

    // ✅ NEW: Endpoint to get a single job by its ID
    getJobById: build.query<JobDetails, string>({
      query: (id) => `http://127.0.0.1:8003/dashboard/salesJobs/${id}`,
      // Provides a specific tag for this job, e.g., { type: 'Job', id: '123' }
      providesTags: (result, error, id) => [{ type: "Job", id }],
    }),

    // ✅ NEW: Endpoint to update a job
    updateJob: build.mutation<JobDetails, Partial<JobDetails> & Pick<JobDetails, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `http://127.0.0.1:8003/dashboard/salesJobs/${id}`,
        method: 'PATCH', // PATCH is best for partial updates
        body: patch,
      }),
      // Invalidates the specific job tag, forcing a refetch of getJobById
      invalidatesTags: (result, error, { id }) => [{ type: "Job", id }],
    }),

    // Mutation to create a new job
    createJob: build.mutation<ActiveJobs, Partial<NewJobPayload>>({
        query: (body) => ({
            url: 'http://127.0.0.1:8003/dashboard/salesJobs',
            method: 'POST',
            body,
        }),
        // Invalidates the 'ActiveJobs' tag to trigger a refetch of the job list
        invalidatesTags: ['ActiveJobs'],
    }),
  }),
});

export const {
  useGetActiveJobsQuery,
  useCreateJobMutation, 
  useGetJobByIdQuery,
  useUpdateJobMutation,
} = api;