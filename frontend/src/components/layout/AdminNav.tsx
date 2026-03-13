"use client";

import {
  CalendarDays,
  Home,
  Receipt,
  Tickets,
  UserKey,
  Volleyball,
} from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

type NavItem = {
  label: string;
  icon: ReactNode;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <Home />, href: "/admin" },
  { label: "Users", icon: <UserKey />, href: "/admin/users" },
  { label: "Sports", icon: <Volleyball />, href: "/admin/sports" },
  { label: "Matches", icon: <CalendarDays />, href: "/admin/matches" },
  { label: "Transactions", icon: <Receipt />, href: "/admin/transactions" },
  { label: "BetList", icon: <Tickets />, href: "/admin/betlist" },
];

export function AdminNav() {
  return (
    <div>

        {/* Nav Items */}
        <nav>
            {navItems.map((item) => {

                return (
                    <Link key={item.label} href={item.href}>
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                )
            })}
        </nav>

    </div>
  );
}
