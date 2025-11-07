import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { AuthAPI } from "../../services/api";
import { ArrowLeft } from "lucide-react";

export function LoginScreen() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await AuthAPI.getGoogleAuthUrl();
      window.location.href = res.url;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="absolute -top-12 left-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Card className="w-full">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img
                src="/banner.png"
                alt="Logo del Semillero"
                className="max-w-full h-auto"
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

        </CardContent>
        </Card>
      </div>
    </div>
  );
}
