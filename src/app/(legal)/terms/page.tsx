import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Terms of service · Leadworks" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" intro={`The rules for using ${site.name}. By creating an account you agree to them.`}>
      <h3>The service</h3>
      <p>
        {site.name} is a lead inbox for small businesses. It collects enquiries from your website, shows them in one place, helps you reply, and, on paid plans, writes AI replies, runs a website chat, shows offers and publishes blog posts.
      </p>

      <h3>Your account</h3>
      <ul>
        <li>You must give a real email address and keep your password safe. You are responsible for what happens under your account.</li>
        <li>You must be able to enter a contract and be using Leadworks for business.</li>
        <li>You must confirm your email before we send you alerts or send automatic emails for you.</li>
      </ul>

      <h3>What you may and may not do</h3>
      <ul>
        <li>Only contact people who enquired with you or who have agreed to hear from you. Do not use Leadworks to send spam.</li>
        <li>Do not put anything unlawful, misleading or harmful into your profile, offers, replies or blog posts.</li>
        <li>Do not copy our script onto sites you do not own, try to access other accounts, or overload the service.</li>
        <li>Follow the laws that apply to your messages, including consent and unsubscribe rules. Automatic emails carry a stop link; do not remove it.</li>
      </ul>

      <h3>AI-written content</h3>
      <p>
        The AI writes from the information you give it. It can still make mistakes. You are responsible for checking your business profile, and for what is sent in your name. You can turn AI replies and automatic follow-ups off at any time.
      </p>

      <h3>Plans, payment and cancelling</h3>
      <ul>
        <li>The Free plan has a monthly lead allowance. If you pass it, your leads are still saved and shown, and paid automations pause until the next month or until you upgrade.</li>
        <li>Pro is billed monthly through Razorpay at the price shown on our pricing page, which can include taxes. It renews until you cancel.</li>
        <li>You can cancel at any time from Account. Pro stays on until the end of the period you paid for, then your account moves to Free. Your data is kept.</li>
        <li>If you downgrade or cancel, Pro-only parts on your website, such as the chat bubble and offers, stop appearing. Your website itself is not affected.</li>
        <li>See the <a href="/refunds">refund policy</a> for refunds.</li>
      </ul>

      <h3>Your data</h3>
      <p>
        Your leads, chats and content belong to you. You allow us to store and process them to run the service, as described in the <a href="/privacy">privacy policy</a>.
      </p>

      <h3>Availability</h3>
      <p>
        We work to keep Leadworks running, but we cannot promise it will never be interrupted. We may change or remove features, and will tell you in advance about changes that affect what you pay for.
      </p>

      <h3>Limits of liability</h3>
      <p>
        The service is provided as it is. To the extent the law allows, we are not liable for lost profits or indirect losses, and our total liability for any claim is limited to what you paid us in the three months before it arose.
      </p>

      <h3>Ending your account</h3>
      <p>
        You may stop using Leadworks at any time. We may suspend an account that breaks these terms, after warning you where that is reasonable.
      </p>

      <h3>Governing law</h3>
      <p>These terms are governed by the laws of India. Courts in India have jurisdiction over disputes.</p>
    </LegalPage>
  );
}
