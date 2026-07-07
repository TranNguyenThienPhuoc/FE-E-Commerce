import { apiClient } from "./api";
import { ApiResponse } from "@/interfaces";

export interface CreateSupportTicketDTO {
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  customerId?: string;
}

export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSupportTicketDTO {
  status?: "open" | "in-progress" | "resolved" | "closed";
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  replyMessage?: string;
}

export const supportService = {
  async createTicket(data: CreateSupportTicketDTO): Promise<ApiResponse<SupportTicket>> {
    return await apiClient.post<ApiResponse<SupportTicket>, CreateSupportTicketDTO>("/support-tickets", data);
  },

  async getTickets(status?: string): Promise<ApiResponse<SupportTicket[]>> {
    const params = status && status !== "all" ? `?status=${status}` : "";
    return await apiClient.get<ApiResponse<SupportTicket[]>>(`/support-tickets${params}`);
  },

  async updateTicket(id: string, data: UpdateSupportTicketDTO): Promise<ApiResponse<SupportTicket>> {
    return await apiClient.put<ApiResponse<SupportTicket>, UpdateSupportTicketDTO>(`/support-tickets/${id}`, data);
  },
};
