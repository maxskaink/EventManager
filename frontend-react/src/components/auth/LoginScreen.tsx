import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { AuthAPI } from "../../services/api";

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await AuthAPI.getGoogleAuthUrl();
      window.location.href = res.url;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
        alert(error.message);
        setError(error.message);
      }
    }
  };

  const handleGuestLogin = () => {};

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1695556575317-9d49e3dccf75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwbG9nbyUyMGFjYWRlbWljfGVufDF8fHx8MTc1NjA1NTkwMnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Logo del Semillero"
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>
          <h1>Semillero Académico</h1>
          <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/*
          <div className="space-y-2">
            <label htmlFor="email">Correo electrónico</label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password">Contraseña</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button onClick={handleLogin} className="w-full" disabled={!email || !password}>
            Iniciar sesión
          </Button>
*/}
          <Button onClick={handleLogin} className="w-full">
            Iniciar sesión con Google
          </Button>
          {/*
          <Button variant="outline" onClick={handleGuestLogin} className="w-full">
            Ingresar como invitado
          </Button>
          */}

          <div className="text-center">
            <button onClick={() => navigate("/forgot-password")} className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              No tienes cuenta? <span className="text-primary">Regístrate</span>
            </button>
          </div>

          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Cuentas de prueba:</p>
            <div className="space-y-1 text-xs">
              <p>
                <strong>Integrante:</strong> member@test.com / 123
              </p>
              <p>
                <strong>Coordinador:</strong> coordinator@test.com / 123
              </p>
              <p>
                <strong>Mentor:</strong> mentor@test.com / 123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
