import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const resources = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/resources' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		image: z.string(),
		category: z.enum(['Tutorial', 'Guide', 'Article', 'Notes']),
		difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
		tags: z.array(z.string()),
		date: z.date(),
		readTime: z.number(),
		prerequisites: z.array(z.string()).optional(),
		version: z.string().optional(),
		wip: z.boolean().optional(),
	})
});

export const collections = { resources };
