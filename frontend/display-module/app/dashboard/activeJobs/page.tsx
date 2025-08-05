"use client";

import { useState } from "react";
// NOTE: Ensure 'useCreateJobMutation' is exported from your state/api file.
import {
  useGetActiveJobsQuery,
  useCreateJobMutation,
} from "../../../state/api";
import Header from "../{components}/Header";
import { DataGrid, GridColDef} from "@mui/x-data-grid";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import CreateJobModal from "./CreateJobModal"; // Adjust path to your new modal component

type JobFormData = {
  name: string;
  description: string;
  deadline: string;
  assignee: string;
  status: string;
  category: string;
};

const columns: GridColDef[] = [
    {
        field: "id",
        headerName: "Job ID",
        width: 90,
        type: "number",
      },
  { field: "name", headerName: "Job Name", width: 200 },
  { field: "status", headerName: "Status", width: 110 },
];

// You can rename this component back to "Inventory" if you prefer
const ActiveJobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pass searchTerm to the query. Your API slice must be set up to use it.
  const {
    data: activeJobs,
    isError,
    isLoading,
  } = useGetActiveJobsQuery(searchTerm || undefined);

  // Hook for the create job mutation
  const [createJob] = useCreateJobMutation();

  const handleCreateJob = async (jobData: JobFormData) => {
    try {
      // Convert deadline to ISO string if your backend expects it, otherwise adjust as needed
      const payload = {
        ...jobData,
        deadline: jobData.deadline ? new Date(jobData.deadline).toISOString() : null,
      };
      await createJob(payload).unwrap(); // .unwrap() provides better error handling
      setIsModalOpen(false); // Close modal on success
    } catch (error) {
      console.error("Failed to create job:", error);
      alert("Error: Could not create the job. See console for details.");
    }
  };

  if (isLoading) {
    return <div className="py-4 text-center">Loading...</div>;
  }

  if (isError || !activeJobs) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch active jobs
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <Header name="Active Jobs" />
        <button
          className="flex items-center justify-center w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Create Job
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search jobs by name, status, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Grid */}
      <div style={{ height: 650, width: "100%" }}>
        <DataGrid
          rows={activeJobs}
          columns={columns}
          getRowId={(row) => row.id}
          checkboxSelection
          className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700"
        />
      </div>

      {/* Modal for Creating a New Job */}
      <CreateJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateJob}
      />
    </div>
  );
};

export default ActiveJobs;