import styles from './BadgeControls.module.css';

export interface BadgeControlsProps {
  readonly onReset: () => void;
}

export function BadgeControls({ onReset }: BadgeControlsProps) {
  return (
    <div role="group" aria-label="Badge controls" className={styles.controls}>
      <button type="button" className={styles.button} aria-label="Reset badge" onClick={onReset}>
        <span aria-hidden="true">↺</span> Reset
      </button>
    </div>
  );
}
