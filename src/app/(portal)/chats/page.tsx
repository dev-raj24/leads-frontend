"use client";

import { IconLock, IconTag } from "@/components/icons";
import { Conversations } from "@/components/portal/Conversations";
import { EmptyState } from "@/components/portal/EmptyState";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { useMySite } from "@/hooks/sites/query";
import { useTenant } from "@/hooks/tenant/query";

export default function ChatsPage() {
  const { data: tenantData } = useTenant();
  const { data: siteData, isLoading } = useMySite();
  const isPro = tenantData?.tenant.plan === "pro";
  const on = (siteData?.site.settings as Record<string, unknown> | undefined)?.widget === true;

  return (
    <>
      <PageHead
        eyebrow="Inbox"
        title={<>Website <em>chats</em></>}
        sub="Conversations from your chat page. A chat becomes a lead once the visitor shares a phone number or email."
        actions={isPro && on ? <Button href="/ai-widget" variant="secondary" size="sm">Chat settings</Button> : undefined}
      />

      {!isLoading && !isPro && (
        <div className="pnl">
          <EmptyState
            icon={<IconLock size={26} />}
            title="Website chat is a Pro feature"
            text="Upgrade to Pro for a chat page that answers visitors around the clock and lets your team step in."
            action={<Button href="/account" icon={<IconTag size={15} />}>View plans</Button>}
          />
        </div>
      )}
      {!isLoading && isPro && !on && (
        <div className="pnl">
          <EmptyState
            icon={<IconTag size={26} />}
            title="Turn on website chat first"
            text="Switch chat on and conversations from your chat page will start showing up here."
            action={<Button href="/ai-widget">Set up chat</Button>}
          />
        </div>
      )}
      {isPro && on && <Conversations />}
    </>
  );
}
