"use client";

import Link, { type LinkProps } from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps extends LinkProps<Route> {
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, exact = false, href, ...props }, ref) => {
    const pathname = usePathname();
    const normalizedHref = typeof href === "string" ? href : (href.pathname ?? "");
    const isActive = normalizedHref
      ? exact
        ? pathname === normalizedHref
        : pathname?.startsWith(normalizedHref)
      : false;

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
