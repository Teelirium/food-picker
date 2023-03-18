import { z } from 'zod';

export const ModalMethods = ['GET', 'POST', 'UPDATE'] as const;

const modalMethodSchema = z.enum(ModalMethods);
export default modalMethodSchema;

export type ModalMethod = z.infer<typeof modalMethodSchema>;
