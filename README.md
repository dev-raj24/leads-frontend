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
