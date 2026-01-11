import { http, httpBlob } from "../api/http";
import type { TimeEntryReportResponse } from "../types/timeEntries";

export async function getMyReport(from: string, to: string) {
  return await http<TimeEntryReportResponse>({
    method: "GET",
    path: "/api/time-entries/my",
    query: { from, to },
  });
}

export async function getMyReportPdf(from: string, to: string) {
  return await httpBlob({
    method: "GET",
    path: "/api/time-entries/my/pdf",
    query: { from, to },
  });
}