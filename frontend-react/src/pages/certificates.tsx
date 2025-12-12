import { useQuery } from "@tanstack/react-query";
import { CertificateAPI } from "@/services/api";
import { UnifiedHeader } from "@/components/layout/UnifiedHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Building2, Calendar, ExternalLink, Loader2 } from "lucide-react";
import useGoToDashboard from "@/hooks/useGoToDashboard";

const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Page to see the cerficiates
 * @deprecated I think this page is not used
 * @returns 
 */
export default function CertificatesPage() {
  const goToDashboard = useGoToDashboard();

  const { data, isLoading } = useQuery({
    queryKey: ["certificates", "my"],
    queryFn: CertificateAPI.listMyCertificates,
  });

  const certificates: API.Certificate[] = data?.certificates ?? [];

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      {/* Header a ancho completo */}
      <UnifiedHeader title="Mis Certificados" onGoBack={() => goToDashboard()} />

      {/* Contenido */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Resumen */}
        {(() => {
          const now = new Date();
          const active = certificates.filter(
            (c) => c.does_not_expire || (c.expiration_date && new Date(c.expiration_date) >= now),
          ).length;
          const expired = certificates.length - active;
          return (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Aquí puedes ver y acceder a todos tus certificados.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Totales: {certificates.length}</Badge>
                <span className="rounded-full border px-2.5 py-1 text-xs bg-emerald-50 border-emerald-200 text-emerald-700">Vigentes: {active}</span>
                <span className="rounded-full border px-2.5 py-1 text-xs bg-rose-50 border-rose-200 text-rose-700">Vencidos: {expired}</span>
              </div>
            </div>
          );
        })()}

        {isLoading ? (
          <div className="p-10 text-center flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 mb-3 text-sky-700 animate-spin" />
            <p className="text-gray-600">Cargando certificados...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center text-gray-600 flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-sky-50 mb-3">
              <Award className="w-8 h-8 text-sky-700" />
            </div>
            <p className="mb-1">No has registrado ningún certificado aún.</p>
            <p className="text-sm text-slate-500">Cuando tengas uno, aparecerá aquí para descargarlo.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg hover:-translate-y-0.5 bg-white/95 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-2 rounded-lg bg-sky-50">
                          <Award className="w-4 h-4 text-sky-700" />
                        </span>
                        <h4
                          className="tracking-tight font-semibold text-[#0a2740] overflow-hidden"
                          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                        >
                          {cert.name}
                        </h4>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-sky-800 shrink-0" />
                          <span className="text-xs overflow-hidden text-ellipsis whitespace-nowrap">{cert.issuing_organization}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-sky-800 shrink-0" />
                          <span className="text-xs">Emitido: {formatDate(cert.issue_date)}</span>
                        </div>
                        {cert.expiration_date && !cert.does_not_expire && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-sky-800 shrink-0" />
                            <span className="text-xs">Expira: {formatDate(cert.expiration_date)}</span>
                          </div>
                        )}
                        {cert.does_not_expire && (
                          <Badge variant="secondary" className="text-[10px]">No expira</Badge>
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
                    {/* Acción futura: descargar/editar si aplica */}
                    <Button size="sm" variant="secondary" className="bg-sky-700 text-white hover:bg-sky-800" asChild>
                      <a
                        href={cert.credential_url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!cert.credential_url}
                        className={!cert.credential_url ? "pointer-events-none opacity-50" : undefined}
                      >
                        Descargar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
