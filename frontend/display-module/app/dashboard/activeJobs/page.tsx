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
import { createTheme, ThemeProvider } from "@mui/material/styles"; 
import { useAppSelector } from "../redux";
import CreateJobModal from "./CreateJobModal"; 
import { useRouter } from "next/navigation";


// --- MUI THEMES ---
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1f2937',
      paper: '#374151',
    },
    text: {
      primary: '#ffffff',
      secondary: '#d1d5db',
    },
  },
});
// --- END MUI THEMES ---

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


  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const activeTheme = isDarkMode ? darkTheme : lightTheme; 

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
      <div className="mb-6">
        <div className="relative">
          {/* This div positions the icon inside the input field */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* The input has padding on the left (pl-10) to make room for the icon */}
          <input
            type="text"
            className="w-full py-2 pl-10 pr-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search jobs by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Data Grid */}
      <ThemeProvider theme={activeTheme}>
        <div className="flex flex-col">
          <DataGrid
            rows={activeJobs || []}
            columns={columns}
            getRowId={(row) => row.id}
            checkboxSelection
            onRowClick={(params) => router.push(`/dashboard/jobs/${params.row.id}`)}
            className="shadow rounded-lg border mt-5"
          />
        </div>
      </ThemeProvider>

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