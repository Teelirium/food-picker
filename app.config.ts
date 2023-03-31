import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';

export const MAX_WEEKDAYS = dayOfWeekSchema.default(5).parse(process.env.MAX_DAYS);
