"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CoachingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      // ✅ Skip auth routes (no protection needed)
      if (pathname.startsWith("/coaching/auth")) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      // ✅ If not logged in → send to login
      if (!data.session) {
        router.push("/coaching/auth/login");
      } else {
        setLoading(false);
      }
    }

    checkSession();
  }, [router, pathname]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
