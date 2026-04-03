import { apiFetch, API_BASE_URL } from "../src/lib/api";
import { ResumeSummary, ResumeDetail } from "../types/resume.types";

export async function getUserResumes(): Promise<ResumeSummary[]> {
  return apiFetch(`${API_BASE_URL}/api/resumes`);
}

export async function getResumeDetail(id: string): Promise<ResumeDetail> {
  return apiFetch(`${API_BASE_URL}/api/resumes/${encodeURIComponent(id)}`);
}

export async function deleteResume(id: string): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/api/resumes/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete resume");
}
