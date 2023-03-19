import { z } from 'zod';

const dishTypeSchema = z.enum(['PRIMARY', 'SIDE', 'SECONDARY', 'DRINK', 'EXTRA']);

export default dishTypeSchema;
