import styles from './SiteNav.module.css';

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

interface SiteNavProps {
  readonly items: readonly NavItem[];
}

export function SiteNav({ items }: SiteNavProps) {
  return (
    <header className={styles.header} data-print="hide">
      <a className={styles.skip} href="#content">
        Skip to content
      </a>
      <nav aria-label="Primary" className={styles.nav}>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <a className={styles.link} href={`#${item.id}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
