import React from 'react';
import styles from './google-callback.module.css';

/**
 * Componente de UI para el estado de carga del callback de Google.
 */
export const GoogleCallbackLoading: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Procesando autenticación...</p>
    </div>
  );
};