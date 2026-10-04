"use client";

import { useEffect, useState } from "react";
import { IconCard, IconCheck, IconLock } from "@/components/icons";
import { PageHead } from "@/components/portal/PageHead";
import { Button } from "@/components/ui/Button";
import { PLANS } from "@/config/plans";
import { useChangeEmail, useChangePassword, useLogoutAll } from "@/hooks/auth/mutation";
import { useUpdateTenantName } from "@/hooks/tenant/mutation";
import { useTenant } from "@/hooks/tenant/query";
import { useBilling } from "@/hooks/billing/query";
import { useCancelSubscription, useSubscribe } from "@/hooks/billing/mutation";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { authErrorMessage } from "@/lib/errors";
import { timeAgo } from "@/lib/format";
import { getUser } from "@/lib/session";
import type { AuthUser } from "@/types/models";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "subscription", label: "Subscription" },
  { key: "password", label: "Password" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function AccountPage() {
  const [tab, setTab] = useState<TabKey>("profile");
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => setUser(getUser()), []);

  return (
    <>
      <PageHead eyebrow="Workspace" title="Your account." sub="Your profile, password and subscription." />

      <div className="seg" role="tablist" style={{ marginBottom: 24 }}>
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? "on" : ""} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileTab user={user} onUserChange={setUser} />}
      {tab === "subscription" && <SubscriptionTab />}
      {tab === "password" && <PasswordTab />}
    </>
  );
}

function ProfileTab({ user, onUserChange }: { user: AuthUser | null; onUserChange: (user: AuthUser) => void }) {
  const { data } = useTenant();
  const tenant = data?.tenant;
  const updateName = useUpdateTenantName();
  const changeEmail = useChangeEmail();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(tenant?.name ?? "");
  useEffect(() => setName(tenant?.name ?? ""), [tenant?.name]);

  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email ?? "");
  const [emailPassword, setEmailPassword] = useState("");
  useEffect(() => setEmail(user?.email ?? ""), [user?.email]);

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    updateName.mutate(name.trim(), { onSuccess: () => setEditingName(false) });
  }

  function cancelName() {
    setEditingName(false);
    setName(tenant?.name ?? "");
  }

  function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    changeEmail.mutate(
      { newEmail: email.trim(), currentPassword: emailPassword },
      {
        onSuccess: (res) => {
          onUserChange(res.user);
          setEditingEmail(false);
          setEmailPassword("");
        },
      }
    );
  }

  function cancelEmail() {
    setEditingEmail(false);
    setEmail(user?.email ?? "");
    setEmailPassword("");
  }

  return (
    <div className="pnl pad">
      <div className="acct-field">
        {!editingName ? (
          <div className="acct-row">
            <span>Business</span>
            <span className="acct-row-val">
              <strong>{tenant?.name ?? "—"}</strong>
              <button type="button" className="acct-edit" onClick={() => setEditingName(true)}>Edit</button>
            </span>
          </div>
        ) : (
          <form className="acct-edit-panel" onSubmit={saveName}>
            <div className="field">
              <label className="flabel" htmlFor="business-name">Business name</label>
              <input id="business-name" className="finput" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoFocus required />
            </div>
            {updateName.isError && <div className="auth-err">{authErrorMessage(updateName.error)}</div>}
            <div className="acct-inline-actions">
              <Button type="submit" size="sm" loading={updateName.isPending} loadingText="Saving…">Save</Button>
              <Button type="button" size="sm" variant="secondary" onClick={cancelName}>Cancel</Button>
            </div>
          </form>
        )}
      </div>

      <div className="acct-field">
        {!editingEmail ? (
          <div className="acct-row">
            <span>Email</span>
            <span className="acct-row-val">
              <strong>{user?.email ?? "—"}</strong>
              <button type="button" className="acct-edit" onClick={() => setEditingEmail(true)}>Edit</button>
            </span>
          </div>
        ) : (
          <form className="acct-edit-panel" onSubmit={saveEmail}>
            <div className="field">
              <label className="flabel" htmlFor="account-email">New email</label>
              <input id="account-email" className="finput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
            </div>
            <div className="field">
              <label className="flabel" htmlFor="account-email-pw">Current password</label>
              <input
                id="account-email-pw"
                className="finput"
                type="password"
                placeholder="Confirm with your current password"
                autoComplete="current-password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                required
              />
            </div>
            {changeEmail.isError && <div className="auth-err">{authErrorMessage(changeEmail.error)}</div>}
            <div className="acct-inline-actions">
              <Button type="submit" size="sm" loading={changeEmail.isPending} loadingText="Saving…">Save</Button>
              <Button type="button" size="sm" variant="secondary" onClick={cancelEmail}>Cancel</Button>
            </div>
          </form>
        )}
      </div>

      <div className="acct-field">
        <div className="acct-row">
          <span>Role</span>
          <strong>{user?.role === "staff" ? "Staff" : "Owner"}</strong>
        </div>
      </div>
      {tenant?.createdAt && (
        <div className="acct-field">
          <div className="acct-row">
            <span>Member since</span>
            <strong>{timeAgo(tenant.createdAt)} ago</strong>
          </div>
        </div>
      )}
    </div>
  );
}

function SubscriptionTab() {
  const { data: billing } = useBilling();
  const subscribe = useSubscribe();
  const cancel = useCancelSubscription();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const plan = billing?.plan ?? "free";
  const currentPlan = PLANS.find((p) => p.id === plan) ?? PLANS[0];
  const otherPlan = PLANS.find((p) => p.id !== plan)!;
  const usage = billing?.usage;
  const pct = usage ? Math.min(100, Math.round((usage.leadsThisMonth / usage.leadsLimit) * 100)) : 0;
  const renews = billing?.planRenewsAt ? new Date(billing.planRenewsAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : null;

  return (
    <div className="pnl pad acct-plan">
      <div className="acct-plan-current">
        <span className={`pp ${plan === "pro" ? "p" : "c"}`}>{plan === "pro" ? "PRO" : "FREE"}</span>
        <h3 className="acct-plan-name">{currentPlan.name} plan</h3>
        <p className="hint" style={{ marginTop: 2 }}>{currentPlan.blurb}</p>
        {usage && (
          <div className="meter" aria-label="Leads this month">
            <div className="meter-t">
              <span>Leads this month</span>
              <b>{usage.leadsThisMonth} / {usage.leadsLimit}</b>
            </div>
            <div className={`meter-bar ${usage.overLimit ? "over" : usage.nearLimit ? "near" : ""}`}><i style={{ width: `${pct}%` }} /></div>
          </div>
        )}
        {billing?.planStatus === "cancelling" && renews && <p className="hint">Your plan is cancelled and stays active until {renews}. After that you move to Free; nothing is deleted.</p>}
        {billing?.planStatus === "past_due" && <p className="hint" style={{ color: "var(--red)" }}>Your last payment didn&apos;t go through. Pro stays on for a few days while we retry.</p>}
        {plan === "pro" && billing?.planStatus === "active" && renews && <p className="hint">Renews on {renews}.</p>}
        <ul className="acct-features">
          {currentPlan.features.map((f) => (
            <li key={f}>
              <IconCheck size={14} /> {f}
            </li>
          ))}
        </ul>
      </div>

      {plan !== "pro" && (
        <div className="acct-upsell">
          <div className="acct-upsell-t">Unlock with Pro</div>
          <ul className="acct-features locked">
            {currentPlan.locked.map((f) => (
              <li key={f}>
                <IconLock size={12} /> {f}
              </li>
            ))}
          </ul>
          <Button
            variant="lime"
            icon={<IconCard size={15} />}
            loading={subscribe.isPending}
            loadingText="Opening checkout…"
            disabled={billing ? !billing.canSubscribe : false}
            onClick={() => subscribe.mutate()}
          >
            Upgrade to Pro — {otherPlan.price}{otherPlan.per}
          </Button>
          {billing && !billing.canSubscribe && <p className="hint">Payments aren&apos;t switched on yet. Please check back soon.</p>}
          {subscribe.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(subscribe.error)}</div>}
        </div>
      )}

      {plan === "pro" && billing?.planStatus !== "cancelling" && (
        <div className="acct-upsell">
          <div className="acct-upsell-t">Cancel anytime</div>
          <p className="hint" style={{ marginTop: 0 }}>You keep Pro until the end of what you&apos;ve paid for. Your website widgets keep working; Pro-only parts pause quietly and your data stays.</p>
          <Button variant="secondary" onClick={() => setConfirmCancel(true)}>Cancel subscription</Button>
          {cancel.isError && <div className="auth-err" style={{ marginTop: 12 }}>{authErrorMessage(cancel.error)}</div>}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmCancel}
        title="Cancel your Pro plan?"
        message="You'll keep Pro until the end of the period you've paid for. After that, AI replies, chat, offers and automatic follow-ups pause. Your leads and settings stay."
        confirmText="Cancel plan"
        cancelText="Keep Pro"
        isLoading={cancel.isPending}
        onConfirm={() => cancel.mutate(undefined, { onSettled: () => setConfirmCancel(false) })}
        onClose={() => setConfirmCancel(false)}
      />
    </div>
  );
}

function PasswordTab() {
  const changePassword = useChangePassword();
  const logoutAll = useLogoutAll();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mismatch, setMismatch] = useState(false);

  function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  }

  return (
    <div className="pnl pad">
      <form onSubmit={submitPassword} className="acct-pw-form">
        <div className="field">
          <label className="flabel" htmlFor="cur-password">Current password</label>
          <input
            id="cur-password"
            className="finput"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="flabel" htmlFor="new-password">New password</label>
          <input
            id="new-password"
            className="finput"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            placeholder="At least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label className="flabel" htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            className="finput"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {mismatch && <div className="auth-err">New passwords don&apos;t match.</div>}
        {!mismatch && changePassword.isError && <div className="auth-err">{authErrorMessage(changePassword.error)}</div>}
        {changePassword.isSuccess && <p className="hint" style={{ color: "var(--primary)" }}>Password updated.</p>}

        <Button type="submit" loading={changePassword.isPending} loadingText="Saving…">
          Update password
        </Button>
      </form>

      <div className="acct-field" style={{ marginTop: 28 }}>
        <div className="acct-row">
          <span>
            Signed in on other devices?
            <small style={{ display: "block", color: "var(--muted)" }}>Sign out everywhere except this browser. Changing your password does this too.</small>
          </span>
          <Button variant="secondary" size="sm" loading={logoutAll.isPending} loadingText="Signing out…" onClick={() => logoutAll.mutate()}>
            {logoutAll.isSuccess ? "Done" : "Log out everywhere else"}
          </Button>
        </div>
      </div>
    </div>
  );
}
