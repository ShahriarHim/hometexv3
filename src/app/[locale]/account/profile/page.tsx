"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/orderDash");
  }, [router]);

  return null;
}

