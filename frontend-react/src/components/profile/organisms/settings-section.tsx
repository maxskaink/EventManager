import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader } from "../../ui/card";

interface SettingsSectionProps {
  onLogout: () => void;
}

export const SettingsSection = ({ onLogout }: SettingsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <h3>Configuración</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {/*
        <Button variant="outline" className="w-full justify-start">Cambiar contraseña</Button>
        <Button variant="outline" className="w-full justify-start">Notificaciones</Button>
        <Button variant="outline" className="w-full justify-start">Privacidad</Button>
        */}
        <Button variant="destructive" className="w-full justify-start" onClick={onLogout}>Cerrar sesión</Button>
      </CardContent>
    </Card>
  );
};
