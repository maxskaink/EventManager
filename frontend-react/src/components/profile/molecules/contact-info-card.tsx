import { Card, CardHeader, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Edit, Mail, Phone, User } from "lucide-react";
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
  <div className="flex items-center gap-3">
    <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p>{value}</p>
      {subValue && <p className="text-sm text-muted-foreground">{subValue}</p>}
    </div>
  </div>
);

export const ContactInfoCard = ({ contactInfo, email, onEdit, isLoading }: ContactInfoCardProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <h3>Información de Perfil</h3>
        {isLoading ? (
          <L3Loader size={30} />
        ) : (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <InfoItem icon={<Phone className="h-4 w-4 text-blue-600" />} label="Teléfono" value={contactInfo?.phone ?? ""} />
      <InfoItem icon={<Mail className="h-4 w-4 text-green-600" />} label="Email" value={email} />
      {/*<InfoItem icon={<MapPin className="h-4 w-4 text-purple-600" />} label="Dirección" value={contactInfo.address} subValue={contactInfo.city} />*/}
      <InfoItem
        icon={<User className="h-4 w-4 text-orange-600" />}
        label="Universidad"
        value={contactInfo?.university ?? ""}
        subValue={contactInfo?.academic_program ?? ""}
      />
    </CardContent>
  </Card>
);
