# Leadworks web

Next.js 15 (App Router), React Query, Tailwind.

## Setup

    yarn install
    echo "NEXT_PUBLIC_API_URL=http://localhost:4001" > .env.local
    yarn dev

## Layout

    src/app              routes (marketing, auth, portal)
    src/components/ui    Button, Table, modal, skeleton
    src/components       portal shell, page building blocks
    src/services         API calls
    src/hooks            React Query hooks
    src/utils/apiUtils   axios client and endpoint maps
    src/lib              session, formatting, error messages
    public               embeddable widget.js and blog.js

## Public pages and SEO

- `NEXT_PUBLIC_APP_URL` must be the public address of this app (for example `https://app.yourbrand.com`). It is used for canonical links, Open Graph URLs and sitemaps.
- Each Pro blog has public, server-rendered pages: `/b/<site-slug>` and `/b/<site-slug>/<post-slug>`, plus `/b/<site-slug>/sitemap.xml`. Submit the sitemap in Google Search Console.
- Hosted enquiry form: `/f/<site-key>`.
