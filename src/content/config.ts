// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const resources = defineCollection({
	type: 'content',
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
	})
});

export const collections = { resources };