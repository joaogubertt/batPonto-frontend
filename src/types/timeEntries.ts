export type TimeEntryType = "ENTRADA" | "SAIDA";

export type TimeEntryReportItem = {
  id: string;
  type: TimeEntryType;
  timestamp: string; // ISO-8601
};

export type TimeEntryReportResponse = {
  id: string;
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
  entries: TimeEntryReportItem[];
};