import { z } from 'zod';

const mealTimeSchema = z.enum(['Breakfast', 'Lunch', 'Dinner']);

export default mealTimeSchema;
