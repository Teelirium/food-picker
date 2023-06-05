import { z } from 'zod';

export const gradeNameSchema = z.object({
  letter: z.string().max(1),
  number: z.number(),
});
export type GradeName = z.infer<typeof gradeNameSchema>;

export const gradeNamePartialSchema = gradeNameSchema.partial();
export type GradeNamePartial = z.infer<typeof gradeNamePartialSchema>;
