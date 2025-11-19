import { Card, CardHeader, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Edit, Mail, Phone, User, BookOpen } from "lucide-react";
import { L3Loader } from "../../ui/l3-loader";

type ContactInfo = API.Profile;

interface ContactInfoCardProps {
  isLoading?: boolean;
  contactInfo?: ContactInfo;
  email: string;
  onEdit: () => void;
}

const InfoItem = ({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
}) => (
  <div className="group flex items-center gap-3">
    <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-2 transition-transform group-hover:scale-105">
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
      {subValue && <p className="text-sm text-muted-foreground">{subValue}</p>}
    </div>
  </div>
);

export const ContactInfoCard = ({ contactInfo, email, onEdit, isLoading }: ContactInfoCardProps) => (
  <Card className="rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all hover:shadow-lg">
    <CardHeader>
      <div className="flex items-center justify-between">
        <h3 className="tracking-tight">Información de Perfil</h3>
        {isLoading ? (
          <L3Loader size={30} />
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onEdit}
            className="rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InfoItem icon={<Phone className="w-6 h-6 text-sky-800" />} label="Teléfono" value={contactInfo?.phone ?? ""} />
      <InfoItem icon={<Mail className="w-6 h-6 text-sky-800" />} label="Email" value={email} />
      <InfoItem
        icon={<User className="w-6 h-6 text-sky-800" />}
        label="Universidad"
        value={"Universidad del Cauca"}
      />
      <InfoItem
        icon={<BookOpen className="w-6 h-6 text-sky-800" />}
        label="Programa Académico"
        value={contactInfo?.academic_program ?? ""}
      />
    </CardContent>
  </Card>
);
