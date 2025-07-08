# Alt Text Generator

An AI-powered web application that generates accessible alt text for images. Upload an image and get both concise and descriptive alt text to make your content more accessible.

## Features

- **Drag & Drop Upload**: Easy image upload with preview
- **AI-Powered Generation**: Uses OpenAI GPT-4 Vision to generate accurate alt text
- **Dual Output**: Provides both short and long alt text descriptions
- **Save & Manage**: Save generated alt text locally and manage your history
- **Copy to Clipboard**: One-click copying of generated alt text
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **API Integration**: [AI SDK](https://sdk.vercel.ai/) with OpenAI GPT-4 Vision
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Development

```sh
pnpm install
pnpm dev
```

This starts the app in development mode on `http://localhost:3000`.

## Environment Variables

Create a `.env.local` file with:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Build

```sh
pnpm build
```