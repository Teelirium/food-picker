import { z } from 'zod';

export const ModalMethods = ['GET', 'POST', 'UPDATE'] as const;

export const modalMethodSchema = z.enum(ModalMethods);

export type ModalMethod = z.infer<typeof modalMethodSchema>;
