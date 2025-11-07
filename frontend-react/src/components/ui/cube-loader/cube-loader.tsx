import styles from "./cube-loader.module.css";
import type { CSSProperties } from "react";

type CubeLoaderProps = {
  /** Size in px (number) or any CSS size string like '3rem' or '80px'. Defaults to 70.4px */
  size?: number | string;
};

export function CubeLoader({ size = 70.4 }: CubeLoaderProps) {
  // If user provides a number, treat it as pixels; otherwise pass through the string.
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  const style = { ["--size"]: sizeValue } as CSSProperties & Record<string, string>;

  return (
    <div className={styles.spinner} style={style}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
