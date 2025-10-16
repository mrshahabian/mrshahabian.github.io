import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

// Keep all collection exports together at the bottom

// Projects
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).default([]),
      year: z.string().optional(),
      role: z.string().optional(),
      links: z
        .object({
          github: z.string().url().optional(),
          demo: z.string().url().optional(),
          paper: z.string().url().optional(),
        })
        .partial()
        .optional(),
    }),
});

// Publications
const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      authors: z.array(z.string()),
      venue: z.string().optional(),
      year: z.string().optional(),
      doi: z.string().optional(),
      url: z.string().url().optional(),
      abstract: z.string().optional(),
      heroImage: image().optional(),
      videoUrl: z.string().url().optional(),
    }),
});

// Experience
const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      company: z.string(),
      role: z.string(),
      start: z.string(),
      end: z.string().optional(),
      location: z.string().optional(),
      technologies: z.array(z.string()).default([]),
    }),
});

// Education
const education = defineCollection({
  loader: glob({ base: './src/content/education', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      degree: z.string(),
      school: z.string(),
      start: z.string().optional(),
      end: z.string().optional(),
      thesis: z.string().optional(),
    }),
});

// Tutorials (educational content)
const tutorials = defineCollection({
  loader: glob({ base: './src/content/tutorials', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      repo: z.string().url().optional(),
      notebook: z.string().url().optional(),
      video: z.string().url().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

// Events / Workshops
const events = defineCollection({
  loader: glob({ base: './src/content/events', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.string(),
      location: z.string().optional(),
      registrationUrl: z.string().url().optional(),
    }),
});

export const collections = {
  blog,
  projects,
  publications,
  experience,
  education,
  tutorials,
  events,
};
