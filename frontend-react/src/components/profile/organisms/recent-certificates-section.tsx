import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Award } from "lucide-react";

// Tipo simulado - reemplázalo con tu tipo de API.Certificate
interface Certificate {
  id: string;
  title: string;
  topic: string;
  uploadDate: string;
}

interface RecentCertificatesSectionProps {
  certificates: Certificate[];
  formatDate: (dateString: string) => string;
}

export const RecentCertificatesSection = ({ certificates, formatDate }: RecentCertificatesSectionProps) => {
  const navigate = useNavigate();

  if (certificates.length === 0) {
    return null; // No renderizar nada si no hay certificados
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2>Certificados Recientes</h2>
        <Button variant="outline" onClick={() => navigate("/certificates")}>
          Ver todos
        </Button>
      </div>

      <div className="space-y-3">
        {certificates.slice(0, 3).map((cert) => (
          <Card key={cert.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4>{cert.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {cert.topic} • {formatDate(cert.uploadDate)}
                </p>
              </div>
              {/* La lógica de descarga se manejaría aquí */}
              <Button size="sm" variant="outline">
                Descargar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
