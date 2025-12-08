import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  UserManagementTab,
  ProgressTrackingTab,
  ContentReviewTab,
  type Submission,
  type MemberProgressData,
} from "./tabs";

interface MentorTabsProps {
  users: API.User[];
  loadingUsers: boolean;
  submissions: Submission[];
  onApproveSubmission: (id: string) => void;
  onRejectSubmission: (id: string) => void;
  onChangeRole: (userId: number, role: API.UserRole) => Promise<boolean>;
  onViewProfile: (member: MemberProgressData) => void;
  onGenerateReport: (member: MemberProgressData) => void;
  onLoadSubmissions?: () => void; // Callback para cargar submissions
}

export const MentorTabs: React.FC<MentorTabsProps> = ({
  users,
  loadingUsers,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
  onChangeRole,
  onViewProfile,
  onGenerateReport,
  onLoadSubmissions,
}) => {
  return (
    <Tabs defaultValue="users" className="space-y-6 w-full" onValueChange={(value) => {
      // Cargar submissions cuando se accede a la tab de revisión
      if (value === "submissions" && onLoadSubmissions) {
        onLoadSubmissions();
      }
    }}>
      <TabsList className="flex w-full gap-1 p-1 rounded-xl bg-muted overflow-x-auto overflow-y-hidden scrollbar-hide">
        <TabsTrigger value="users" className="text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap shrink-0 flex-1 sm:flex-initial">Gestión de Usuarios</TabsTrigger>
        <TabsTrigger value="progress" className="text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap shrink-0 flex-1 sm:flex-initial">Seguimiento de Progreso</TabsTrigger>
        <TabsTrigger value="submissions" className="text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap shrink-0 flex-1 sm:flex-initial">Revisión de Contenido</TabsTrigger>
      </TabsList>

      {/* User Management Tab */}
      <TabsContent value="users" className="space-y-6">
        <UserManagementTab
          users={users}
          loadingUsers={loadingUsers}
          onChangeRole={onChangeRole}
        />
      </TabsContent>

      {/* Progress Tracking Tab */}
      <TabsContent value="progress" className="space-y-6">
        <ProgressTrackingTab
          users={users}
          loadingUsers={loadingUsers}
          onViewProfile={onViewProfile}
          onGenerateReport={onGenerateReport}
        />
      </TabsContent>

      {/* Content Review Tab */}
      <TabsContent value="submissions" className="space-y-6">
        <ContentReviewTab
          users={users}
          submissions={submissions}
          onApproveSubmission={onApproveSubmission}
          onRejectSubmission={onRejectSubmission}
        />
      </TabsContent>
    </Tabs>
  );
};