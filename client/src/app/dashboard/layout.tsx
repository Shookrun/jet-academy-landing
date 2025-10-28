import Sidebar from "@/components/layout/dashboard/sidebar";
import { authOptions } from "@/utils/api/auth";
import AuthProvider from "@/utils/providers/auth/provider";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import React from "react";

export const metadata: Metadata = {
  title: "İdarə Paneli | JET Academy",
  description: "JET Academy İdarə Paneli",
  robots: {
    index: false,
    follow: false,
  },
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen">
      <AuthProvider session={session}>
        <Sidebar />
        <main className="flex-1 bg-gray-100">{children}</main>
      </AuthProvider>
    </div>
  );
}
