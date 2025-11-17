import React from 'react';
import { Link } from 'react-router-dom';

// Estilos en línea para simplicidad y adherencia a los colores del proyecto
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '90vh', // Usamos 90vh para que no se pegue al fondo
  textAlign: 'center',
  backgroundColor: '#f6f6f6',
  color: '#013950',
  fontFamily: 'sans-serif',
};

const headingStyle: React.CSSProperties = {
  fontSize: 'clamp(5rem, 20vw, 10rem)', // Responsive clamp
  fontWeight: 700,
  margin: '0',
  lineHeight: '1',
};

const textStyle: React.CSSProperties = {
  fontSize: 'clamp(1.25rem, 5vw, 1.75rem)',
  margin: '1rem 0',
  fontWeight: 300,
};

const linkStyle: React.CSSProperties = {
  color: '#013950',
  textDecoration: 'underline',
  fontSize: '1rem',
  fontWeight: 500,
  marginTop: '1.5rem',
};

/**
 * Página 404 Not Found.
 * Se muestra cuando no se encuentra ninguna ruta.
 */
export const NotFoundPage: React.FC = () => {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>404</h1>
      <p style={textStyle}>Página No Encontrada</p>
      <Link to="/" style={linkStyle}>
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;