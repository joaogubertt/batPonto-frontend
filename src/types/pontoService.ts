import { http } from "../api/http";

export async function baterPonto(): Promise<void> {
  await http<void>({
    method: "POST",
    path: "/api/time-entries",
    // sem body
  });
}