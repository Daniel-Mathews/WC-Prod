import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ActiveJobs {
  id: number;
  name: string;
  status: string;
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
  tagTypes: ["ActiveJobs"],
  endpoints: (build) => ({
    getActiveJobs: build.query<ActiveJobs[], string | void>({
      query: (search) => ({
        url: "https://127.0.0.1:8003/dashboard/salesJobs",
        params: search ? { search } : {},
      }),
      providesTags: ["ActiveJobs"],
    }),

    // Mutation to create a new job
    createJob: build.mutation<ActiveJobs, Partial<NewJobPayload>>({
        query: (body) => ({
            url: 'https://127.0.0.1:8003/dashboard/salesJobs',
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
  useCreateJobMutation, // Export the new hook
} = api;