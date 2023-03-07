import { z } from 'zod';

const modalMethodSchema = z.enum(['GET', 'POST', 'UPDATE']);

export default modalMethodSchema;
