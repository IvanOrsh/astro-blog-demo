### 1. Initialize a new astro project

```bash
pnpm create astro@latest
```

### 2. Integrate tailwindcss

1. Install deps:

```bash
pnpm add @astrojs/tailwind tailwindcss
```

2. Apply the integration to `astro.config.mjs`

astro.config.mjs:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  // ...
  integrations: [tailwind()],
});
```

3. Create tailwind config:

```bash
pnpm dlx tailwindcss init
```

tailwind.config.mjs:
Update the `content`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 3. Content collections

**Content Collections** in Astro are a structured way to manage content, typically used for sites that are content-heavy, like blogs, documentation, or portfolios. They allow you to define a collection of content (like Markdown or MDX files) in an organized manner and apply schemas to validate and organize the content consistently.

**Key Features of Content Collections**:

1. **Schema Validation**: You can define a schema using a tool like Zod to validate the structure of the content. This ensures that all content in a collection follows a specific format (e.g., every blog post has a title, date, author, etc.).
2. **Structured Data**: Collections provide a way to categorize and access content as structured data. Instead of scattering Markdown or MDX files around, content is centralized and accessible programmatically.
3. **Consistency**: By defining a schema, every piece of content in the collection will adhere to the same structure, reducing errors and making it easier to work with large content-driven websites.
4. **Separation of Content and Presentation**: Content collections help maintain a clean separation between your content (Markdown/MDX) and the presentation logic (React, Vue, or Astro components).

**When to Use Content Collections**:

- **Blogs**: If you're building a blog, you can create a content collection for your posts and ensure that all posts follow the same structure (e.g., title, published date, tags).
- **Documentation Sites**: For sites with a lot of docs, you can organize your documentation into collections with sections and subsections, ensuring consistency in structure.
- **Portfolios**: If you're displaying projects or case studies, collections can help you manage them in a structured way, ensuring that each project follows the same template.
- **Large Content-driven Websites**: Any site that needs to manage a lot of structured content, like a news site or knowledge base, can benefit from content collections to handle large volumes of information in an organized and predictable manner.

**Example Usage**:
In Astro, content collections typically reside in the `src/content` directory. Here's an example of how you might define and use a blog collection:

1. **Define the Collection:**
   Create a directory for your collection and define the schema:

   ```ts
   // src/content/blog/collection.ts
   import { defineCollection, z } from "astro:content";

   const blogCollection = defineCollection({
     schema: z.object({
       title: z.string(),
       date: z.date(),
       description: z.string(),
       author: z.string(),
       tags: z.array(z.string()),
     }),
   });

   export const collections = {
     blog: blogCollection,
   };
   ```

2. **Create Content:**
   Add content following the defined schema:

   ```md
   ## // src/content/blog/my-first-post.md

   title: "My First Blog Post"
   date: "2023-10-03"
   description: "This is my first blog post using Astro."
   author: "John Doe"
   tags: ["Astro", "JavaScript", "SSG"]

   ---

   Welcome to my blog! This is a post about using Astro...
   ```

3. **Fetch and Render Content:**
   Fetch the content from the collection and render it in a component or page:

   ```ts
   // src/pages/blog.astro
   ---
   import { getCollection } from 'astro:content';
   const blogPosts = await getCollection('blog');
   ---

   <ul>
     {blogPosts.map(post => (
       <li key={post.id}>
         <a href={`/blog/${post.slug}`}>{post.data.title}</a>
         <p>{post.data.description}</p>
       </li>
     ))}
   </ul>
   ```

### 4. Static output

1. Create a folder (ouf your choice) with the following structure:

`/blog/[slug].astro`

2. Create dynamic routes for blog posts

`[slug].astro`:

```astro
---
import { getCollection, type CollectionEntry } from "astro:content";

export const getStaticPaths = async () => {
  const posts = await getCollection("posts");

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug,
    },

    props: {
      post,
    },
  }));

  return paths;
};

interface Props {
  post: CollectionEntry<"posts">;
}

const { post } = Astro.props;
---

{post.data.title}
```

### 5. Pagination (from docs)

- Paginated route names should **use the same `[bracket]` syntax as a standard dynamic route**.
- You can use `paginate()` function to generate these pages for an array of values:

`/pages/blog/[page].astro`:

```astro
---
import type { GetStaticPaths, Page } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

import H1 from "@components/H1.astro";
import Main from "@components/Main.astro";
import PostList from "@components/PostList.astro";
import Layout from "@layouts/Layout.astro";

export const getStaticPaths = (async ({ paginate }) => {
  const allPosts = await getCollection("posts");

  return paginate(allPosts, {
    pageSize: 6,
  });
}) satisfies GetStaticPaths;

interface Props {
  page: Page;
}

const { page } = Astro.props;
const posts = page.data as CollectionEntry<"posts">[];

/*
what can we expect from page?

 data: [
 {
  // ...
 },
  // ...
 ],

  start: 0,
  end: 5,
  size: 6,
  total: 10,
  currentPage: 1,
  lastPage: 2,
  url: {
    current: '/blog/1',
    next: '/blog/2',
    prev: undefined,
    first: undefined,
    last: '/blog/2'
  }
}
*/
---

<Layout title="Blog - Astro Course">
  <Main>
    <H1 text="Blog Title" />
    <p class="text-secondary-900 text-2xl mb-24 max-sm:mb-14">
      Here is the place for some description, 10 to 15 words max.
    </p>
    <PostList {posts} />
  </Main>
</Layout>
```
