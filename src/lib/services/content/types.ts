export type IncludedCategory = {
    title: string;
    bullets: string[];
};

export type Phase = {
    number: string;
    name: string;
    description: string;
    deliverable: string;
};

export type ServiceContent = {
    slug: 'bedrock' | 'unity' | 'flutter' | 'websites';
    included: IncludedCategory[];
    outOfScope: string[];
    deliverables: string[];
};
