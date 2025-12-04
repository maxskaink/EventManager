import React from "react";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";
import { Edit3, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { Submission } from "./types"; // Importamos el tipo

interface ContentReviewTabProps {
  users: API.User[];
  submissions: Submission[];
  onApproveSubmission: (id: string) => void;
  onRejectSubmission: (id: string) => void;
}

export const ContentReviewTab: React.FC<ContentReviewTabProps> = ({
  users,
  submissions,
  onApproveSubmission,
  onRejectSubmission,
}) => {
  const handleEditSubmission = (submissionId: string) => {
    const submission = submissions.find((sub) => sub.id === submissionId);
    if (submission) {
      toast.info(`📝 Editando: ${submission.title}`);
    }
  };

  const pendingSubmissions = submissions.filter(
    (sub) => sub.status === "pending",
  );

  return (
    <Card className="rounded-3xl shadow-md border-0 bg-white">
      <CardHeader>
        <CardTitle>Revisión de Contenido Pendiente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => {
            const submittedByName = submission.submittedById
              ? users.find(u => String(u.id) === submission.submittedById)?.name || "Usuario desconocido"
              : "Sistema";

            return (
              <div key={submission.id} className="rounded-2xl shadow-sm border-0 bg-gray-50 p-6 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{submission.title}</h3>
                      <Badge variant="outline">{submission.type}</Badge>
                      <Badge
                        variant={
                          submission.status === "pending" ? "outline" : "default"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Enviado por: {submittedByName} • {submission.date}
                    </p>
                    <p className="text-sm">{submission.description}</p>
                  </div>
                </div>
                {submission.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => onApproveSubmission(submission.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSubmission(submission.id)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" /> Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" /> Rechazar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Rechazar contenido?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onRejectSubmission(submission.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Rechazar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {submissions.length === 0 && <p>No hay contenido.</p>}
        {submissions.length > 0 && pendingSubmissions.length === 0 && (
          <p>¡Todo al día!</p>
        )}
      </CardContent>
    </Card>
  );
};