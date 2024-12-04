import { z } from "zod";

export const ProjectFields = {
    id: z.number().positive(),
    creatorId: z.number().positive(),
    name: z
        .string({ message: "Название проекта не указано!" })
        .min(2, "Слишком короткое название проекта")
        .max(64, "Слишком длинное название проекта"),
    files: z.array(z.any()).nullable().optional(),
    mbSizeLimit: z.number(),
    mbOccupied: z.number(),
    publicKey: z.string(),
} as const;

export const projectSchema = z.object({
    id: ProjectFields.id,
    creatorId: ProjectFields.creatorId,
    name: ProjectFields.name,
    files: ProjectFields.files,
    mbSizeLimit: ProjectFields.mbSizeLimit,
    mbOccupied: ProjectFields.mbOccupied,
    publicKey: ProjectFields.publicKey,
})