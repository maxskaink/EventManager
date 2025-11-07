import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { BNavBarMentor } from "../ui/b-navbar-mentor";
import { BNavBarMember } from "../ui/b-navbar-member";
import { BNavBarCoordinator } from "../ui/b-navbar-coordinator";
import { BNavBarGuest } from "../ui/b-navbar-guest";
import {
  ArrowLeft,
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

export function CertificatesScreen() {
  const { user, certificates, addCertificate, deleteCertificate } = useApp();
  const navigate = useNavigate()
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    topic?: string;
    file?: string;
  }>({});
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userCertificates = certificates.filter(cert => cert.userId === user?.id);

  const getBackView = () => {
    if (!user) return "login";
    if (user.role === "guest") return "dashboard-guest";
    if (user.role === "coordinator") return "dashboard-coordinator";
    if (user.role === "mentor") return "dashboard-mentor";
    return "dashboard-member";
  };

  const validateForm = (): boolean => {
    const newErrors: { title?: string; topic?: string; file?: string } = {};

    // Validar título
    if (!title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    // Validar temática
    if (!topic.trim()) {
      newErrors.topic = "La temática es obligatoria";
    }

    // Validar archivo
    if (!selectedFile) {
      newErrors.file = "Debes seleccionar un archivo";
    } else {
      // Validar tipo de archivo
      const fileExtension = "." + selectedFile.name.split(".").pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        newErrors.file = `Tipo de archivo no permitido. Solo se permiten: ${ALLOWED_EXTENSIONS.join(", ")}`;
      }
      // Validar tipo MIME
      else if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        newErrors.file = "El tipo de archivo no es válido";
      }
      // Validar tamaño
      else if (selectedFile.size > MAX_FILE_SIZE) {
        newErrors.file = `El archivo es demasiado grande. Tamaño máximo: ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Limpiar error de archivo cuando se selecciona uno nuevo
      if (errors.file) {
        setErrors({ ...errors, file: undefined });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular subida de archivo (en producción sería a un servidor/storage)
      const fileUrl = URL.createObjectURL(selectedFile!);

      addCertificate({
        title: title.trim(),
        topic: topic.trim(),
        fileName: selectedFile!.name,
        fileUrl: fileUrl,
        fileSize: selectedFile!.size,
      });

      // Limpiar formulario
      setTitle("");
      setTopic("");
      setSelectedFile(null);
      setErrors({});

      // Resetear el input de archivo
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      toast.success("Certificado agregado exitosamente");
    } catch (error) {
      toast.error("Error al agregar el certificado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (certificateId: string) => {
    setCertificateToDelete(certificateId);
  };

  const confirmDelete = () => {
    if (certificateToDelete) {
      deleteCertificate(certificateToDelete);
      toast.success("Certificado eliminado exitosamente");
      setCertificateToDelete(null);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (user?.role === "guest") {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/" + getBackView())}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1>Certificados</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="mb-2">Acceso Restringido</h2>
              <p className="text-muted-foreground">
                Esta funcionalidad está disponible solo para integrantes del
                semillero.
              </p>
            </CardContent>
          </Card>
        </div>

        <BNavBarGuest />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/" + getBackView())}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Mis Certificados</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Formulario para agregar certificado */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Agregar Nuevo Certificado
            </h2>
            <p className="text-muted-foreground text-sm">
              Sube tus certificados para construir tu perfil profesional
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Título del certificado <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: Introducción a Machine Learning"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) {
                      setErrors({ ...errors, title: undefined });
                    }
                  }}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Temática */}
              <div className="space-y-2">
                <Label htmlFor="topic">
                  Temática <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="topic"
                  placeholder="Ej: Inteligencia Artificial"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (errors.topic) {
                      setErrors({ ...errors, topic: undefined });
                    }
                  }}
                  className={errors.topic ? "border-destructive" : ""}
                />
                {errors.topic && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.topic}
                  </p>
                )}
              </div>

              {/* Archivo */}
              <div className="space-y-2">
                <Label htmlFor="file-upload">
                  Archivo del certificado <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      id="file-upload"
                      type="file"
                      accept={ALLOWED_EXTENSIONS.join(",")}
                      onChange={handleFileChange}
                      className={`cursor-pointer ${errors.file ? "border-destructive" : ""}`}
                    />
                  </div>
                  {selectedFile && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="flex-1 truncate">{selectedFile.name}</span>
                      <Badge variant="secondary">{formatFileSize(selectedFile.size)}</Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Formatos permitidos: PDF, JPG, PNG. Tamaño máximo: 5MB
                  </p>
                </div>
                {errors.file && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.file}
                  </p>
                )}
              </div>

              {/* Botón de submit */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Agregando..."
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Agregar Certificado
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de certificados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>Mis Certificados ({userCertificates.length})</h2>
          </div>

          {userCertificates.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">No tienes certificados aún</h3>
                <p className="text-muted-foreground">
                  Agrega tu primer certificado usando el formulario de arriba
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {userCertificates.map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="line-clamp-2 mb-1">{certificate.title}</h3>
                            <Badge variant="secondary" className="mb-2">
                              {certificate.topic}
                            </Badge>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <p className="truncate">{certificate.fileName}</p>
                              <div className="flex items-center gap-3">
                                <span>{formatFileSize(certificate.fileSize)}</span>
                                <span>•</span>
                                <span>{formatDate(certificate.uploadDate)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => window.open(certificate.fileUrl, "_blank")}
                          title="Descargar"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(certificate.id)}
                          title="Eliminar"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!certificateToDelete} onOpenChange={() => setCertificateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar certificado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El certificado será eliminado
              permanentemente de tu perfil.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Navigation Bar */}
      {user && user.role === "coordinator" && <BNavBarCoordinator />}
      {user && user.role === "member" && <BNavBarMember />}
      {user && user.role === "mentor" && <BNavBarMentor />}
    </div>
  );
}
