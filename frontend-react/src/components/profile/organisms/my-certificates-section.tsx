import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Plus, Trash2, Calendar, Award, Building2, Loader2, ExternalLink } from "lucide-react";

interface MyCertificatesSectionProps {
  certificates: API.Certificate[];
  onAddCertificate: () => void;
  onDeleteCertificate: (certificateId: number) => void;
  formatDate: (dateString: string) => string;
  isLoading?: boolean;
}

export const MyCertificatesSection = ({
  certificates,
  onAddCertificate,
  onDeleteCertificate,
  formatDate,
  isLoading = false,
}: MyCertificatesSectionProps) => {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="tracking-tight text-[#0a2740] font-semibold">Mis Certificados</h2>
        <Button
          onClick={onAddCertificate}
          size="sm"
          className="rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Certificado
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
          <Loader2 className="w-12 h-12 mb-3 text-sky-700 animate-spin" />
          <p className="text-gray-600">Cargando certificados...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-8 text-center text-gray-600 flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]">
          <Award className="w-12 h-12 mb-3 text-sky-700" />
          <p>No has registrado ningún certificado aún.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 tracking-tight font-semibold text-[#0a2740] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {cert.name}
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-sky-800 shrink-0" />
                        <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{cert.issuing_organization}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-sky-800 shrink-0" />
                        <span className="text-xs">
                          Emitido: {formatDate(cert.issue_date)}
                        </span>
                      </div>
                      {cert.expiration_date && !cert.does_not_expire && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-800 shrink-0" />
                          <span className="text-xs">
                            Expira: {formatDate(cert.expiration_date)}
                          </span>
                        </div>
                      )}
                      {cert.does_not_expire && (
                        <Badge variant="secondary" className="text-xs">
                          No expira
                        </Badge>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-sky-700 hover:underline flex items-center gap-1"
                        >
                          Ver credencial <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteCertificate(cert.id)}
                    className="shrink-0 text-destructive transition-transform hover:scale-105 active:scale-95 hover:bg-destructive/10"
                    title="Eliminar certificado"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
