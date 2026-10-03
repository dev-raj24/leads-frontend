import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Privacy policy · Leadworks" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" intro={`How ${site.legalName} handles your information and your customers' information.`}>
      <h3>Who is who</h3>
      <p>
        You are the business that uses Leadworks. People who fill in your forms, chat with your website or answer your emails are your customers. For your customers&apos; details, you decide why they are collected and we process them for you. For your own account details, we decide, and we are responsible for them.
      </p>

      <h3>What we collect</h3>
      <ul>
        <li><b>Your account:</b> business name, email address, a hashed password, and the plan you chose.</li>
        <li><b>Your business profile:</b> the services, prices, hours and FAQs you type in, so the AI can answer from them.</li>
        <li><b>Your customers&apos; details:</b> the name, phone number or email, message and answers a visitor submits on your website, their chat messages, and the replies sent to them.</li>
        <li><b>Technical data:</b> which website the script ran on, and basic request logs for security and rate limiting.</li>
        <li><b>Payments:</b> handled by Razorpay. We do not see or store card or UPI details; we keep the subscription status and renewal date.</li>
      </ul>

      <h3>What we use it for</h3>
      <ul>
        <li>To show you your leads and chats, and to email you when a new one arrives.</li>
        <li>To send the replies and follow-ups you have switched on, to the people who contacted you.</li>
        <li>To write AI replies, follow-ups and blog posts from the information you gave us.</li>
        <li>To run, secure and bill the service. We do not sell personal data and we do not use your customers&apos; details for advertising.</li>
      </ul>

      <h3>Who we share it with</h3>
      <p>We use a small number of providers to run Leadworks, and they only receive what the feature needs:</p>
      <ul>
        <li>Google (Gemini) receives your business profile and the text of the enquiry or chat when AI writes a reply, follow-up or blog post.</li>
        <li>Our email provider delivers the emails Leadworks sends on your behalf.</li>
        <li>Razorpay processes subscription payments.</li>
        <li>Our hosting and database providers store the data.</li>
      </ul>

      <h3>Emails to your customers</h3>
      <p>
        Automatic emails to a customer include a link to stop them. When someone uses it, we stop all automatic emails from your account to that address.
      </p>

      <h3>How long we keep it</h3>
      <p>
        We keep your data while your account is open. If you stop using Leadworks and ask us to delete your account, we remove your account, leads, chats and settings. Some records, such as payment records, are kept for as long as the law requires.
      </p>

      <h3>Your rights</h3>
      <p>
        You can ask to see, correct or delete the personal information we hold about you. Your customers can ask you, and you can ask us to help. Write to the address below and we will respond within a reasonable time, and within any period the law sets.
      </p>

      <h3>Security</h3>
      <p>
        Passwords are stored hashed. Data is sent over encrypted connections. Each account&apos;s data is separated from every other account. No system is perfectly safe; if we learn of a breach that affects you, we will tell you.
      </p>

      <h3>Children</h3>
      <p>Leadworks is for businesses. It is not meant for people under 18.</p>

      <h3>Changes</h3>
      <p>If we change this policy in a way that matters, we will tell you by email or in the dashboard before it takes effect.</p>
    </LegalPage>
  );
}
