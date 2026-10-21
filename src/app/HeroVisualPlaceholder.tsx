import styles from './HeroVisualPlaceholder.module.css';

export function HeroVisualPlaceholder() {
  return <div aria-hidden="true" className={styles.placeholder} />;
}
