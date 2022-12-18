import { z } from "zod";

const idSchema = z.coerce.number().min(0);

export default idSchema;
