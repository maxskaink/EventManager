import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader } from '../ui/card';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useApp } from '../AppContext';
import { ArrowLeft } from 'lucide-react';

export function RegisterScreen() {
  const { setCurrentView } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = () => {
    // Mock registration
    console.log('Registering user:', formData);
    setCurrentView('login');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.fullName && formData.email && formData.password;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCurrentView('login')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex justify-center flex-1">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1695556575317-9d49e3dccf75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbG9nbyUyMGFjYWRlbWljfGVufDF8fHx8MTc1NjA1NTkwMnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Logo del Semillero"
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
            <div className="w-10"></div>
          </div>
          <h1>Registro de Integrante</h1>
          <p className="text-muted-foreground">Únete a nuestro semillero</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName">Nombre completo</label>
            <Input
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email">Correo electrónico</label>
            <Input
              id="email"
              type="email"
              placeholder="juan@universidad.edu"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password">Contraseña</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={!isFormValid}
          >
            Registrarme
          </Button>

          <div className="text-center">
            <button 
              onClick={() => setCurrentView('login')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ¿Ya tienes cuenta? <span className="text-primary">Inicia sesión</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}