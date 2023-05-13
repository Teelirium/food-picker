import { stripTimeFromDate } from 'utils/dateHelpers';
import { z } from 'zod';

const dateSchema = z.preprocess((val) => stripTimeFromDate(z.coerce.date().parse(val)), z.date());
export default dateSchema;
