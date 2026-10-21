import type { Project } from '@/domain/profile';
import { Section } from '@/ui/Section';
import { TagList } from '@/ui/TagList';
import styles from './ProjectsSection.module.css';

interface ProjectsSectionProps {
  readonly id: string;
  readonly projects: readonly Project[];
}

export function ProjectsSection({ id, projects }: ProjectsSectionProps) {
  return (
    <Section id={id} title="Side projects" eyebrow="Projects">
      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project }: { readonly project: Project }) {
  const headingId = `project-${project.id}`;

  return (
    <article aria-labelledby={headingId} className={styles.card}>
      <h3 id={headingId} className={styles.name}>
        {project.name}
      </h3>
      <p className={styles.description}>{project.description}</p>
      <TagList label={`Technologies for ${project.name}`} tags={project.technologies} />
      {(project.url ?? project.repoUrl) && (
        <p className={styles.links}>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Live demo of ${project.name}`}
            >
              Live demo
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Source code for ${project.name}`}
            >
              Source code
            </a>
          )}
        </p>
      )}
    </article>
  );
}
