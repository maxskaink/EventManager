import styles from "./l3-loader.module.css";
import type { CSSProperties } from "react";

type L3LoaderProps = {
  /** Width in px (number) or any CSS size string like '3rem' or '80px'. Defaults to 45px */
  size?: number | string;
};

export function L3Loader({ size = 45 }: L3LoaderProps) {
  const sizeValue = typeof size === "number" ? `${size}px` : size;
  const style = { ["--size"]: sizeValue } as CSSProperties & Record<string, string>;

  return <div className={styles.loader} style={style}></div>;
}
