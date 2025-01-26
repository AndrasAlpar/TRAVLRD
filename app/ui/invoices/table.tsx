import Image from "next/image";

import { cookies } from "next/headers";
import { UpdateInvoice, DeleteInvoice } from "@/app/ui/invoices/buttons";
import InvoiceStatusWrapper from "@/app/ui/invoices/InvoiceStatusWrapper";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredInvoices } from "@/app/lib/data";

const TABS = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "Overdue", value: "overdue" },
  { label: "Canceled", value: "closed" },
];

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const cookieStore = await cookies();
  const selectedTab = cookieStore.get('selectedTab')?.value || 'all';

  // Fetch invoices based on the selected tab
  const invoices = await fetchFilteredInvoices(
    query,
    selectedTab === 'all' ? '' : selectedTab,
    currentPage
  );

  return (
    <div className="mt-6 flow-root">
      {/* Tabs */}
      <div className="flex justify-start space-x-4 mb-4 border-b pb-2">
        {TABS.map((tab) => (
          <a
            key={tab.value}
            href={`?tab=${tab.value}`}
            className={`px-4 py-2 text-sm font-medium ${
              selectedTab === tab.value
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={async () => {
              'use server'; // Mark this as a server-side action
              const serverCookies = await cookies(); // Await cookies again here
              serverCookies.set('selectedTab', tab.value); // Set the cookie
            }}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No invoices found for the selected status.
            </div>
          ) : (
            <table className="min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">Customer</th>
                  <th className="px-3 py-5 font-medium">Email</th>
                  <th className="px-3 py-5 font-medium">Amount</th>
                  <th className="px-3 py-5 font-medium">Date</th>
                  <th className="px-3 py-5 font-medium">Status</th>
                  <th className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b text-sm">
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={invoice.image_url}
                          className="rounded-full"
                          width={28}
                          height={28}
                          alt={`${invoice.name}'s profile picture`}
                        />
                        <p>{invoice.name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {invoice.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDateToLocal(invoice.date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <InvoiceStatusWrapper
                        invoiceId={invoice.id}
                        initialStatus={invoice.status}
                      />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateInvoice id={invoice.id} />
                        <DeleteInvoice id={invoice.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
