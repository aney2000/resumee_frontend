import styles from './TagList.module.css';

interface TagListProps {
  readonly label: string;
  readonly tags: readonly string[];
}

export function TagList({ label, tags }: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul aria-label={label} className={styles.list}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
