import { z } from 'zod';

const modalSchema = z.coerce.number().min(0).max(1);

export default modalSchema;
