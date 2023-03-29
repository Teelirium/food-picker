import dayOfWeekSchema from 'utils/schemas/dayOfWeekSchema';

export const maxWeekdays = dayOfWeekSchema.default(5).parse(process.env.MAX_DAYS);
