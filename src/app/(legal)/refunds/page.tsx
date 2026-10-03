import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Refund policy · Leadworks" };

export default function RefundsPage() {
  return (
    <LegalPage title="Refund policy" intro="Plain rules for cancelling and getting money back.">
      <h3>Cancelling</h3>
      <p>You can cancel Pro at any time from Account, Subscription. You keep Pro until the end of the period you have already paid for. We do not charge you again after that.</p>

      <h3>Refunds</h3>
      <ul>
        <li>Subscription payments are not refunded for the part of a period that has already started.</li>
        <li>If you were charged twice, charged after you cancelled, or charged by mistake, write to us and we will refund that charge.</li>
        <li>If Pro was not available to you for a long stretch because of a fault on our side, write to us and we will make it right.</li>
      </ul>

      <h3>How refunds are paid</h3>
      <p>Approved refunds go back to the original payment method through Razorpay. Banks usually take 5 to 7 working days to show them.</p>
    </LegalPage>
  );
}
