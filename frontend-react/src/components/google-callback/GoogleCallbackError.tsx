import React from 'react';
import { Link } from 'react-router-dom';
import styles from './google-callback.module.css';

interface GoogleCallbackErrorProps {
  error: { message: string } | null;
}

/**
 * Componente de UI para el estado de error del callback de Google.
 */
export const GoogleCallbackError: React.FC<GoogleCallbackErrorProps> = ({ error }) => {
  const errorMessage = error?.message || 'No se pudo completar el inicio de sesión.';
  
  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <h1 className={styles.errorTitle}>Error de Autenticación</h1>
        <p className={styles.errorMessage}>
          {errorMessage}
        </p>
        <Link to="/" className={styles.backLink}>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};