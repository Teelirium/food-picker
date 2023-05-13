import { z } from 'zod';

const teacherPage = z.enum(['attendance', 'debt']);

export default teacherPage;
