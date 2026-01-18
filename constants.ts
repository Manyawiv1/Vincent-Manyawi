
import { Entity, EntityType } from './types';

export const ENTITIES: Entity[] = [
  { id: 'mz-farm', name: 'Chicoa', country: 'Mozambique', type: EntityType.FARM },
  { id: 'zm-farm', name: 'Kariba Harvest', country: 'Zambia', type: EntityType.FARM },
  { id: 'zw-farm', name: 'Lake Harvest', country: 'Zimbabwe', type: EntityType.FARM },
  { id: 'zw-dist', name: 'Lake Harvest Distribution', country: 'Zimbabwe', type: EntityType.DISTRIBUTION },
  { id: 'mw-dist', name: 'Pende', country: 'Malawi', type: EntityType.DISTRIBUTION },
];

export const INITIAL_NEWSLETTER_PROMPT = `
Act as a world-class Executive Operations Director for "Mvuvi Group".
Your task is to write a cohesive "Executive Overview" (approx 150-200 words) for the weekly newsletter.
Summarize the performance across the 3 fish farms (Chicoa in Mozambique, Kariba Harvest in Zambia, Lake Harvest in Zimbabwe) and 2 distribution hubs (Lake Harvest Distribution in Zimbabwe, Pende in Malawi).

Focus on:
1. Consolidated group revenue vs targets.
2. Operational health (production levels, logistics).
3. Critical financial notes (cash position, receivables).
4. ESG/Safety highlights.

Tone: Objective, professional, and strategic. Use one solid paragraph or two short ones. No fluff.
`;
