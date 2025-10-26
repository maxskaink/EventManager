import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Save, X } from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";

type ContactInfo = Omit<API.Profile, "id" | "user_id">;

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ContactInfo;
  onSave: (data: ContactInfo) => void;
}

export const EditContactDialog = ({ open, onOpenChange, initialData, onSave }: EditContactDialogProps) => {
  const [formData, setFormData] = useState<ContactInfo>(initialData ?? ({} as ContactInfo));

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Información de Perfil</DialogTitle>
          <DialogDescription>Actualiza tu información de contacto personal.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="text-sm">Teléfono</label>
            <Input name="phone" value={formData.phone ?? ""} onChange={handleChange} />
          </div>
          {/*<div><label className="text-sm">Dirección</label><Input name="address" value={formData.address} onChange={handleChange} /></div>*/}
          {/*<div><label className="text-sm">Ciudad</label><Input name="city" value={formData.city} onChange={handleChange} /></div>*/}
          <div>
            <label className="text-sm">Universidad</label>
            <Input name="university" value={formData.university ?? ""} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm">Programa Académico</label>
            <Input name="academic_program" value={formData.academic_program ?? ""} onChange={handleChange} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
