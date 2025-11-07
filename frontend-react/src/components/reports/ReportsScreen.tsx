import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useApp } from "../context/AppContext";
import { BNavBarMentor } from "../ui/b-navbar-mentor";
import { BNavBarCoordinator } from "../ui/b-navbar-coordinator";
import {
  ArrowLeft,
  Users,
  Award,
  Calendar,
  TrendingUp,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import BottomNavbarWrapper from "../nav/BottomNavbarWrapper";
import { useAuthStore } from "../../stores/auth.store";

export function ReportsScreen() {
  const { user } = useApp();
  const someUser = useAuthStore(s => s.user);
  const navigate = useNavigate()
  const [reportType, setReportType] = useState("participation");
  const [timeFilter, setTimeFilter] = useState("all");

  // Mock data for member participation
  const memberStats = [
    {
      id: "1",
      name: "Ana García",
      email: "ana@example.com",
      avatar: "",
      eventsAttended: 8,
      certificates: 5,
      participation: 85,
      lastActivity: "2024-01-15",
      interests: ["Machine Learning", "React"],
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos@example.com",
      avatar: "",
      eventsAttended: 12,
      certificates: 8,
      participation: 95,
      lastActivity: "2024-01-20",
      interests: ["Python", "Data Science"],
    },
    {
      id: "3",
      name: "María Rodríguez",
      email: "maria@example.com",
      avatar: "",
      eventsAttended: 6,
      certificates: 3,
      participation: 70,
      lastActivity: "2024-01-10",
      interests: ["Web Development", "UI/UX"],
    },
    {
      id: "4",
      name: "David Silva",
      email: "david@example.com",
      avatar: "",
      eventsAttended: 15,
      certificates: 12,
      participation: 100,
      lastActivity: "2024-01-22",
      interests: ["Backend", "DevOps"],
    },
  ];

  const totalMembers = memberStats.length;
  const averageAttendance = Math.round(
    memberStats.reduce(
      (sum, member) => sum + member.eventsAttended,
      0,
    ) / totalMembers,
  );
  const totalCertificates = memberStats.reduce(
    (sum, member) => sum + member.certificates,
    0,
  );
  const averageParticipation = Math.round(
    memberStats.reduce(
      (sum, member) => sum + member.participation,
      0,
    ) / totalMembers,
  );

  const getParticipationColor = (participation: number) => {
    if (participation >= 90)
      return "text-green-600 bg-green-100";
    if (participation >= 70)
      return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getParticipationLabel = (participation: number) => {
    if (participation >= 90) return "Excelente";
    if (participation >= 70) return "Buena";
    return "Mejorable";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              navigate("/dashboard-coordinator")
            }
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1>Reportes de Participación</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Filtros */}
        <section>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">
                    Tipo de Reporte
                  </label>
                  <Select
                    value={reportType}
                    onValueChange={setReportType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participation">
                        Participación de Integrantes
                      </SelectItem>
                      <SelectItem value="events">
                        Rendimiento de Eventos
                      </SelectItem>
                      <SelectItem value="achievements">
                        Logros y Certificaciones
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm text-muted-foreground">
                    Período
                  </label>
                  <Select
                    value={timeFilter}
                    onValueChange={setTimeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        Todo el tiempo
                      </SelectItem>
                      <SelectItem value="semester">
                        Este semestre
                      </SelectItem>
                      <SelectItem value="month">
                        Este mes
                      </SelectItem>
                      <SelectItem value="week">
                        Esta semana
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 items-end">
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Métricas generales */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl">{totalMembers}</h3>
              <p className="text-sm text-muted-foreground">
                Integrantes Activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl">{averageAttendance}</h3>
              <p className="text-sm text-muted-foreground">
                Promedio Asistencia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl">{totalCertificates}</h3>
              <p className="text-sm text-muted-foreground">
                Certificados Emitidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-orange-100 rounded-lg w-fit mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl">
                {averageParticipation}%
              </h3>
              <p className="text-sm text-muted-foreground">
                Participación Promedio
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Gráficos resumen */}
        <section>
          <h2 className="mb-4">Análisis Visual</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h4>Asistencia por Evento</h4>
                <p className="text-sm text-muted-foreground">
                  Comparativa mensual
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Ver Gráfico
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                  <PieChart className="h-8 w-8 text-green-600" />
                </div>
                <h4>Distribución por Interés</h4>
                <p className="text-sm text-muted-foreground">
                  Áreas de enfoque
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Ver Gráfico
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                  <LineChart className="h-8 w-8 text-purple-600" />
                </div>
                <h4>Tendencia de Participación</h4>
                <p className="text-sm text-muted-foreground">
                  Evolución temporal
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                >
                  Ver Gráfico
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tabla de integrantes */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2>Detalle por Integrante</h2>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar Lista
            </Button>
          </div>

          <div className="space-y-3">
            {memberStats.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{member.name}</h4>
                        <Badge
                          className={`text-xs ${getParticipationColor(member.participation)}`}
                        >
                          {getParticipationLabel(
                            member.participation,
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.interests.map((interest) => (
                          <Badge
                            key={interest}
                            variant="outline"
                            className="text-xs"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-medium">
                            {member.eventsAttended}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Eventos
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            {member.certificates}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Certificados
                          </p>
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            {member.participation}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Participación
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Última actividad:{" "}
                        {new Date(
                          member.lastActivity,
                        ).toLocaleDateString("es-ES")}
                      </p>
                    </div>

                    <Button size="sm" variant="outline">
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Acciones adicionales */}
        <section>
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-4">Acciones Adicionales</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar Reporte Completo
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Programar Reporte Automático
                </Button>
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Enviar Resumen por Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Navigation Bar */}
      <BottomNavbarWrapper role={someUser?.role ?? ""} />
    </div>
  );
}
