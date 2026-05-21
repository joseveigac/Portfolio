import type { ServiceContent } from './types';
import { BEDROCK_CONTENT }  from './bedrock';
import { UNITY_CONTENT }    from './unity';
import { FLUTTER_CONTENT }  from './flutter';
import { WEBSITES_CONTENT } from './websites';

export type { ServiceContent, IncludedCategory, Phase } from './types';
export { BEDROCK_CONTENT, UNITY_CONTENT, FLUTTER_CONTENT, WEBSITES_CONTENT };
export { SHARED_PHASES } from './shared';

export const CONTENT_BY_SLUG: Record<ServiceContent['slug'], Record<'en' | 'es', ServiceContent>> = {
    bedrock:  BEDROCK_CONTENT,
    unity:    UNITY_CONTENT,
    flutter:  FLUTTER_CONTENT,
    websites: WEBSITES_CONTENT,
};
