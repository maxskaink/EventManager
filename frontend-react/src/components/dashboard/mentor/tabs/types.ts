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