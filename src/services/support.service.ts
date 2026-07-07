import { apiClient } from "./api";

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
  async createTicket(data: CreateSupportTicketDTO): Promise<SupportTicket> {
    return await apiClient.post<SupportTicket, CreateSupportTicketDTO>("/support-tickets", data);
  },

  async getTickets(status?: string): Promise<SupportTicket[]> {
    const params = status && status !== "all" ? `?status=${status}` : "";
    // Note: get in apiClient doesn't accept params object as 2nd arg easily if it's not defined
    return await apiClient.get<SupportTicket[]>(`/support-tickets${params}`);
  },

  async updateTicket(id: string, data: UpdateSupportTicketDTO): Promise<SupportTicket> {
    return await apiClient.put<SupportTicket, UpdateSupportTicketDTO>(`/support-tickets/${id}`, data);
  },
};
