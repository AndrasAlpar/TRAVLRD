"use client";

import {
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";

export default function InvoiceStatus({
  status,
  onChange,
  isUpdating,
}: {
  status: string;
  onChange: (newStatus: string) => void;
  isUpdating: boolean;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          icon: <ClockIcon className="ml-1 w-4 text-gray-500" />,
          color: "bg-gray-100 text-gray-500",
        };
      case "paid":
        return {
          label: "Paid",
          icon: <CheckIcon className="ml-1 w-4 text-white" />,
          color: "bg-green-500 text-white",
        };
      case "overdue":
        return {
          label: "Overdue",
          icon: <ExclamationCircleIcon className="ml-1 w-4 text-white" />,
          color: "bg-red-500 text-white",
        };
      default:
        return { label: "", icon: null, color: "" };
    }
  };

  const currentStatus = getStatusDetails(status);

  const handleStatusChange = (newStatus: string) => {
    setDropdownOpen(false);
    if (newStatus !== status) {
      onChange(newStatus);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className={clsx(
          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
          currentStatus.color,
          { "opacity-50": isUpdating }
        )}
        onClick={() => setDropdownOpen((prev) => !prev)}
        disabled={isUpdating}
      >
        {currentStatus.label}
        {currentStatus.icon}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-36 bg-white border rounded shadow-lg">
          {["pending", "paid", "overdue"].map((s) => {
            const statusDetails = getStatusDetails(s);
            return (
              <button
                key={s}
                className={clsx(
                  "flex items-center justify-between w-full px-4 py-2 text-left text-sm rounded",
                  statusDetails.color,
                  { "opacity-50": isUpdating }
                )}
                onClick={() => handleStatusChange(s)}
                disabled={isUpdating}
              >
                <span>{statusDetails.label}</span>
                {statusDetails.icon}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
