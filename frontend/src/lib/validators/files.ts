import { z } from "zod";

export const FileFields = {
    id: z.number().positive(),
    projectId: z.number().positive(),
    name: z.string(),
    mb: z.number(),
    createdAt: z.string().or(z.date()),
    location: z.string()
} as const;

export const fileSchema = z.object({
    id: FileFields.id,
    projectId: FileFields.projectId,
    name: FileFields.name,
    mb: FileFields.mb,
    createdAt: FileFields.createdAt,
    location: FileFields.location
})

export type FileKl = z.infer<typeof fileSchema>