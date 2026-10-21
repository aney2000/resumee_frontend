import type { SkillGroup } from '@/domain/profile';
import { Section } from '@/ui/Section';
import { TagList } from '@/ui/TagList';
import styles from './SkillsSection.module.css';

interface SkillsSectionProps {
  readonly id: string;
  readonly skills: readonly SkillGroup[];
}

export function SkillsSection({ id, skills }: SkillsSectionProps) {
  return (
    <Section id={id} title="Skills" eyebrow="Toolbox">
      <div className={styles.groups}>
        {skills.map((group) => (
          <div key={group.category} className={styles.group}>
            <h3 className={styles.category}>{group.category}</h3>
            <TagList label={`${group.category} skills`} tags={group.items} />
          </div>
        ))}
      </div>
    </Section>
  );
}
