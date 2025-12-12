import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { AuthAPI } from "../../services/api";
import { ArrowLeft } from "lucide-react";
import logoImg from "../../assets/logo.png";
import fietImg from "../../assets/FIET.jpg";
import "./login.css";

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
    <div
      className="login-bg relative min-h-screen flex items-center justify-center px-4 py-10"
      style={{ '--login-bg-image': `url(${fietImg})` } as React.CSSProperties}
    >
      {/* Capa decorativa de patrón */}
      {/* Capa decorativa de patrón */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100/40 via-white/30 to-blue-200/40 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 pointer-events-none select-none opacity-5 animate-noise mix-blend-soft-light" />

      <div className="w-full max-w-sm relative animate-in fade-in zoom-in-95 duration-500">
        <Card className="login-panel w-full overflow-hidden transition-all duration-300 pt-8 pb-8 border-blue-300/60 bg-blue-50/90 backdrop-blur-md shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/80">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="absolute top-3 left-3 hover:bg-primary/10"
            aria-label="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardHeader className="text-center space-y-4 pb-2">
            <img
              src={logoImg}
              alt="Logo Semillero Ciencia de Datos"
              className="w-full max-w-none h-auto mx-auto drop-shadow-xl animate-logoFloat select-none px-2 hover:scale-105 transition-transform duration-500"
              decoding="async"
              fetchPriority="high"
              draggable={false}
              style={{ objectFit: 'contain', maxHeight: '110px' }}
            />
            <h1 className="text-xl font-semibold tracking-tight">Semillero Académico</h1>
            <p className="text-xs leading-relaxed opacity-90">
              Conecta con la comunidad, colabora y potencia tu aprendizaje.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-[10px] uppercase tracking-wider opacity-80">Acceso rápido</p>
              <div className="h-px w-16 mx-auto bg-gradient-to-r from-blue-400/60 via-blue-500/50 to-blue-400/60" />
            </div>

            <Button
              onClick={handleLogin}
              className="group relative w-full h-14 font-semibold text-lg rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/40 hover:shadow-blue-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="inline-block transition-transform group-hover:scale-105">Iniciar sesión con Google</span>
              </span>
              {/* Brillo animado */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute -inset-1 animate-glow rounded-lg" />
                <span className="absolute inset-0 animate-gradient-mask bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.25),transparent_70%)]" />
              </span>
              {/* Ripple al hacer clic */}
              <span className="pointer-events-none absolute inset-0" aria-hidden />
            </Button>

            <p className="text-[10px] text-center opacity-80 leading-relaxed">
              Al continuar aceptas nuestras políticas de privacidad y uso de datos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
