import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  UserManagementTab,
  ProgressTrackingTab,
  type MemberProgressData,
} from "./tabs";

interface MentorTabsProps {
  users: API.User[];
  loadingUsers: boolean;
  onChangeRole: (userId: number, role: API.UserRole) => Promise<boolean>;
  onViewProfile: (member: MemberProgressData) => void;
  onGenerateReport: (member: MemberProgressData) => void;
}

export const MentorTabs: React.FC<MentorTabsProps> = ({
  users,
  loadingUsers,
  onChangeRole,
  onViewProfile,
  onGenerateReport,
}) => {
  return (
    <Tabs defaultValue="users" className="space-y-6 w-full">
      <TabsList className="flex w-full gap-1 p-1 rounded-xl bg-muted">
        <TabsTrigger value="users" className="text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap shrink-0 flex-1 sm:flex-initial">Gestión de Usuarios</TabsTrigger>
        <TabsTrigger value="progress" className="text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap shrink-0 flex-1 sm:flex-initial">Seguimiento de Progreso</TabsTrigger>
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
    </Tabs>
  );
};