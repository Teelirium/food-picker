import { z } from 'zod';

const dayOfWeekSchema = z.coerce.number().min(0).max(6);

export default dayOfWeekSchema;
