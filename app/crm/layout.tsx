"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/crm/layout/AppSidebar";

interface CrmLayoutProps {
  children: ReactNode;
}

export default function CrmLayout({ children }: CrmLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-[72px] md:pl-64 transition-[padding] duration-200">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
