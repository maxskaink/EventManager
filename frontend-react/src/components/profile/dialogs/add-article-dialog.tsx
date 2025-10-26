import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NewArticle {
    title: string;
    description: string;
    publicationDate: string;
    authors: string;
    publicationUrl: string;
}

interface AddArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddArticle: (article: NewArticle) => void;
}

const initialState: NewArticle = { title: "", description: "", publicationDate: "", authors: "", publicationUrl: "" };

export const AddArticleDialog = ({ open, onOpenChange, onAddArticle }: AddArticleDialogProps) => {
    const [newArticle, setNewArticle] = useState<NewArticle>(initialState);

    const handleAdd = () => {
        if (Object.values(newArticle).some(val => !val)) {
            toast.error("Por favor completa todos los campos");
            return;
        }
        onAddArticle(newArticle);
        setNewArticle(initialState);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Artículo</DialogTitle>
                    <DialogDescription>Registra una publicación en la que hayas participado.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div><Label htmlFor="article-title">Título *</Label><Input id="article-title" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}/></div>
                    <div><Label htmlFor="article-description">Descripción *</Label><Textarea id="article-description" value={newArticle.description} onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}/></div>
                    <div><Label htmlFor="article-authors">Autores *</Label><Input id="article-authors" value={newArticle.authors} onChange={(e) => setNewArticle({ ...newArticle, authors: e.target.value })}/></div>
                    <div><Label htmlFor="article-date">Fecha de publicación *</Label><Input id="article-date" type="date" value={newArticle.publicationDate} onChange={(e) => setNewArticle({ ...newArticle, publicationDate: e.target.value })}/></div>
                    <div><Label htmlFor="article-url">URL de publicación *</Label><Input id="article-url" type="url" value={newArticle.publicationUrl} onChange={(e) => setNewArticle({ ...newArticle, publicationUrl: e.target.value })}/></div>
                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button onClick={handleAdd}><CheckCircle2 className="h-4 w-4 mr-2" />Agregar Artículo</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
