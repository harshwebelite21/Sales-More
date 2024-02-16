import { TicketStatus } from '../customer-support.model';

export interface GetTicketsInterface {
  subject: string;
  description: string;
  status: TicketStatus;
  userName: string;
  mobileNo: string;
  Email: string;
}
