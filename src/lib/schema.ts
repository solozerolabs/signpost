import { z } from "zod";

const publicAssetPath = z
	.string()
	.regex(/^\/(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[^?#]+$/, "must be a root-relative public asset path");

export const profileSchema = z.object({
	name: z.string(),
	handle: z.string().optional(),
	role: z.string().optional(),
	bio: z.string().optional(),
	avatar: publicAssetPath.default("/avatar.png"),
	url: z.string().url(),
	email: z.string().email().optional(),
	location: z.string().optional(),
});

export const themeSchema = z.object({
	accent: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/, "accent must be a 6-digit hex like #D6491E")
		.default("#D6491E"),
	color_scheme: z.enum(["auto", "dark", "light"]).default("auto"),
});

export const socialSchema = z.object({
	platform: z.string(),
	handle: z.string().optional(),
	label: z.string().optional(),
	url: z.string().url(),
});

export const productSchema = z.object({
	title: z.string(),
	sub: z.string().optional(),
	url: z.string().url(),
});

// Optional single hero CTA rendered above the fold (data/featured.yaml). Absent
// file -> no hero, so every existing instance is unaffected.
export const featuredSchema = z.object({
	title: z.string(),
	sub: z.string().optional(),
	cta: z.string().default("Open"),
	url: z.string().url(),
});

// Optional signup copy (data/signup.yaml). Absent file -> a bare email form
// with a "Join" button, i.e. every existing instance is unaffected.
export const signupSchema = z.object({
	title: z.string().optional(),
	sub: z.string().optional(),
	cta: z.string().default("Join"),
	consent: z.string().default("Weekly build log. No spam. Unsubscribe anytime."),
});

export const aeoSchema = z.object({
	title: z.string(),
	description: z.string(),
	image: z.object({
		src: publicAssetPath,
		width: z.number().int().positive(),
		height: z.number().int().positive(),
		alt: z.string().min(1),
	}),
});

export type Profile = z.infer<typeof profileSchema>;
export type Social = z.infer<typeof socialSchema>;
export type Product = z.infer<typeof productSchema>;
export type Featured = z.infer<typeof featuredSchema>;
export type Signup = z.infer<typeof signupSchema>;
