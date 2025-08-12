// app/jobs/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetJobByIdQuery, useUpdateJobMutation } from "../../../../state/api"; // Adjust import path
import { format } from 'date-fns';
import { ArrowLeft, Info, Tag, User } from "lucide-react";

// Define the available status options
const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In-Progress" },
    { value: "completed", label: "Completed" },
];

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;

    const { data: job, isLoading, isError, isSuccess } = useGetJobByIdQuery(jobId);
    const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

    // --- Local state for all editable fields ---
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (isSuccess && job) {
            setDescription(job.description || "");
            setDeadline(job.deadline ? format(new Date(job.deadline), 'yyyy-MM-dd') : "");
            setStatus(job.status);
        }
    }, [isSuccess, job]);

    const handleSaveChanges = async () => {
        try {
            const updatedDeadline = deadline ? new Date(deadline).toISOString() : null;
            await updateJob({ id: Number(jobId), description, deadline: updatedDeadline, status }).unwrap();
            alert("Job updated successfully!");
        } catch (error) {
            console.error("Failed to update job:", error);
            alert("Error: Could not update the job.");
        }
    };

    if (isLoading) return <div className="p-6 text-center">Loading job details...</div>;
    if (isError) return <div className="p-6 text-center text-red-500">Error fetching job details.</div>;
    if (!job) return <div className="p-6 text-center">Job not found.</div>;

    const hasChanges = (description !== (job.description || "")) || 
                     (deadline !== (job.deadline ? format(new Date(job.deadline), 'yyyy-MM-dd') : "")) || 
                     (status !== job.status);

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* --- Page Header --- */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white-700 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-white-300" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray">{job.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Job ID: {job.id}</p>
                </div>
            </div>

            {/* --- Main Content Layout --- */}
            <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">

                {/* --- Left Column: Editable Fields --- */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            rows={8}
                            placeholder="Enter job description..."
                        />
                    </div>
                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Deadline</label>
                        <input
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full md:w-auto p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="text-right pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleSaveChanges}
                            disabled={!hasChanges || isUpdating}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* --- Right Column: Static & Editable Details --- */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
                    <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 text-gray-800 dark:text-gray-100">Details</h2>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <Info className="w-5 h-5 mt-1 text-blue-500" />
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full p-2 mt-1 border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <User className="w-5 h-5 mt-1 text-blue-500" />
                            <div>
                                <strong className="block text-sm text-gray-500 dark:text-gray-400">Assignee</strong>
                                <span className="text-base text-gray-900 dark:text-white">{job.assignee || 'Unassigned'}</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <Tag className="w-5 h-5 mt-1 text-blue-500" />
                            <div>
                                <strong className="block text-sm text-gray-500 dark:text-gray-400">Category</strong>
                                <span className="text-base text-gray-900 dark:text-white">{job.category || 'N/A'}</span>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
}