"use client";

import { useTransition, useState } from "react";
import InvoiceStatus from "./status";

export default function InvoiceStatusWrapper({
  invoiceId,
  initialStatus,
}: {
  invoiceId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/dashboard/invoices/${invoiceId}/edit`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error("Failed to update invoice status");
        }

        setStatus(newStatus);
      } catch (error) {
        console.error(error);
        alert("Failed to update invoice status");
      }
    });
  };

  return (
    <InvoiceStatus
      status={status}
      onChange={handleStatusChange}
      isUpdating={isPending}
    />
  );
}
