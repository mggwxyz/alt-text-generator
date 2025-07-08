import { createServerFn } from '@tanstack/react-start'

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const generateAltText = createServerFn({method: 'POST'})
.validator(data => {
  console.log('data', data)
  return z.object({
    image: z.string(),
    prompt: z.string(),
    variability: z.number(),
  }).parse(data)
})
.handler(async ({data}) => {
  const { image, prompt, variability } = data;

  const { object } = await generateObject({
    model: openai('gpt-4o'),
    // prompt: prompt,
    messages: [
      {
        role: "user",
        content: prompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: image,
          },
        ],
      },
    ],
    schema: z.object({
      shortText: z.string(),
      longText: z.string(),
    }),
  });

  return object;
})