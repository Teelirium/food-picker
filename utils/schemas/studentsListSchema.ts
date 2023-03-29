import { z } from 'zod';

const studentsListSchema = z.enum(['attendance', 'arrears']);

export default studentsListSchema;
