import { USER_ROLES as USER_ROLES_CONSTANTS } from "../../../../features/users/user.contants";

export const USER_ROLES: API.UserRole[] = USER_ROLES_CONSTANTS

export type Submission = {
  id: string;
  type: string;
  title: string;
  submittedById: string | null;
  date: string;
  status: "pending" | "approved" | "rejected";
  description: string;
};

export type MemberProgressData = API.User & {
  joinDate: string;
  progress: number;
  eventsAttended: number;
  certificatesEarned: number;
};