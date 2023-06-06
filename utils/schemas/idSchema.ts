import { z } from 'zod';

const idSchema = z.coerce.number().min(0, 'ID не может быть меньше 0');

export default idSchema;

export const idObjectSchema = z.object({ id: idSchema });
