import { z } from 'zod';

const techsRequestSchema = z.object({
    leader: z.string(),
    playerScenario: z.string().max(1000),
    techs: z.array(z.string()).optional()
});

export default techsRequestSchema;