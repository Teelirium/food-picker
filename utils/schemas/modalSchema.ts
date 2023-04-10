import { z } from 'zod';

const idSchema = z.coerce.number().min(0).max(1);

export default idSchema;
