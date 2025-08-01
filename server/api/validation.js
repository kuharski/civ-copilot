import { z } from 'zod';

const techsRequestSchema = z.object({
    leader: z.string().max(40),
    playerScenario: z.string().max(750),
    techs: z.array(z.string()).max(81).optional()
});

export default techsRequestSchema;
