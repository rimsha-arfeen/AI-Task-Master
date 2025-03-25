import { z } from "zod";

export interface FileWithPath extends File {
  path?: string;
}

export const analysisResponseSchema = z.object({
  overall_score: z.number(),
  breakdown: z.object({
    naming: z.number(),
    modularity: z.number(),
    comments: z.number(),
    formatting: z.number(),
    reusability: z.number(),
    best_practices: z.number(),
  }),
  recommendations: z.array(z.string()),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;

export interface CategoryInfo {
  name: string;
  maxScore: number;
  color: string;
  bgColor: string;
  icon?: string;
}

export const CATEGORIES: Record<keyof AnalysisResponse['breakdown'], CategoryInfo> = {
  naming: {
    name: 'Naming',
    maxScore: 10,
    color: 'text-primary',
    bgColor: 'bg-blue-100'
  },
  modularity: {
    name: 'Modularity',
    maxScore: 20,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  comments: {
    name: 'Comments',
    maxScore: 20,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  formatting: {
    name: 'Formatting',
    maxScore: 15,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  reusability: {
    name: 'Reusability',
    maxScore: 15,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100'
  },
  best_practices: {
    name: 'Best Practices',
    maxScore: 20,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
};
