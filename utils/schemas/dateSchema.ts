import { z } from 'zod';

import { stripTimeFromDate } from 'utils/dateHelpers';

const dateSchema = z.preprocess((val) => stripTimeFromDate(z.coerce.date().parse(val)), z.date());
export default dateSchema;
