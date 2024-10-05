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

### 6. SEO #TODO: more stuff required!

"OG" tags, short for **Open Graph** tags, are meta tags used in the HTML of a webpage to control how content is displayed when shared on social media platforms like Facebook, Twitter, LinkedIn, and others. They aren't HTML tags like `<div>` or `<p>`, but rather **meta tags** that exist in the `<head>` section of a webpage. Open Graph was introduced by Facebook but is now widely supported across different platforms.

---

**What Do OG Tags Do?**
OG tags define structured data about the webpage, allowing control over:

- **Title**: What title appears when shared.
- **Description**: The summary or description of the content.
- **Image**: A specific image that appears in the preview.
- **URL**: The canonical URL to which the share should link.

---

**Common OG Tags**
Here are some of the key Open Graph meta tags:

1. **`og:title`**: The title of your page or content.
   ```html
   <meta property="og:title" content="Amazing Website Title" />
   ```
2. **`og:description`**: A short description that will appear beneath the title.
   ```html
   <meta
     property="og:description"
     content="A brief summary of what this page is about."
   />
   ```
3. **`og:image`**: The URL of the image you want to display in the preview.
   ```html
   <meta property="og:image" content="https://example.com/image.jpg" />
   ```
4. **`og:url`**: The canonical URL that people will be directed to.
   ```html
   <meta property="og:url" content="https://example.com/page" />
   ```

---

**Importance for SEO and Social Sharing**
While OG tags don't directly affect search engine rankings (like Google), they are crucial for **social media sharing**. If properly implemented:

- They help attract more clicks by providing well-structured, appealing previews.
- They prevent social platforms from picking random content for the preview, ensuring a consistent brand image.

OG tags ensure that when your content is shared, it looks professional, with the right image and text displayed.

---

```astro
---
import Header from "@components/Header.astro";
import Footer from "@components/Footer.astro";
import "@fontsource/cabin";

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const {
  title,
  description = "Blog description is expected here",
  image = "/images/drums.png",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>

    <!-- og -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={Astro.url} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content={description} />

    <!-- for twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={Astro.url} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={image} />
    <meta property="twitter:image:alt" content={description} />
  </head>
  <body class="min-h-screen grid grid-rows-[auto,1fr,auto]">
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

### 7. RSS feed
