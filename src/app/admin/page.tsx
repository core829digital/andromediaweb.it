import { Suspense } from "react";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { LoginForm } from "./login-form";
import { AdminDashboard } from "./admin-dashboard";
import { LogoMark } from "@/components/logo";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

function GateFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-foreground">
      <div className="animate-pulse">
        <LogoMark light className="h-12" />
      </div>
    </div>
  );
}

async function AdminGate() {
  const token = (await cookies()).get("aw_admin")?.value;
  const email = verifySessionToken(token);
  if (!email) return <LoginForm />;
  return <AdminDashboard email={email} />;
}

export default function AdminPage() {
  return (
    <Suspense fallback={<GateFallback />}>
      <AdminGate />
    </Suspense>
  );
}
