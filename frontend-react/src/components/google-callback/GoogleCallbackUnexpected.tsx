import React from 'react';
import { Link } from 'react-router-dom';
import styles from './google-callback.module.css';

/**
 * Componente de UI para un estado de fallback inesperado.
 */
export const GoogleCallbackUnexpected: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <h1 className={styles.errorTitle}>Estado Inesperado</h1>
        <p className={styles.errorMessage}>
          No estás autenticado, pero no se reportó un error.
        </p>
        <Link to="/" className={styles.backLink}>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};