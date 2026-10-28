import styles from './BadgeControls.module.css';

export interface BadgeControlsProps {
  readonly onReset: () => void;
  readonly onCut: () => void;
  readonly canCut: boolean;
}

export function BadgeControls({ onReset, onCut, canCut }: BadgeControlsProps) {
  return (
    <div role="group" aria-label="Badge controls" className={styles.controls}>
      <button
        type="button"
        className={styles.button}
        aria-label="Cut the lanyard"
        disabled={!canCut}
        onClick={onCut}
      >
        <span aria-hidden="true">✂</span> Cut
      </button>
      <button type="button" className={styles.button} aria-label="Reset badge" onClick={onReset}>
        <span aria-hidden="true">↺</span> Reset
      </button>
    </div>
  );
}
