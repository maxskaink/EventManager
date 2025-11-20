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
}) => {
  return (
    <Tabs defaultValue="users" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
        <TabsTrigger value="progress">Seguimiento de Progreso</TabsTrigger>
        <TabsTrigger value="submissions">Revisión de Contenido</TabsTrigger>
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