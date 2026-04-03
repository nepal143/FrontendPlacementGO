export interface ResumeSummary {
  id: string;
  originalFileName: string;
  jobDescriptionSnippet: string;
  templateName: string;
  status: string;
  createdAt: string;
}

export interface ResumeDetail extends ResumeSummary {
  jobDescription: string;
  pdfBase64: string;
  generatedLatex: string;
}
