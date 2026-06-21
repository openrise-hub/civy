"use client";

import Link from "next/link";
import { LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getGravatarUrl } from "@/lib/gravatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import { signOut } from "@/lib/auth/actions";
import { useUser } from "@/contexts/UserContext";

export function UserNav() {
  const { user } = useUser();
  const email = user?.email || "";
  const name = user?.user_metadata?.display_name || email.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer hover:opacity-80 transition-opacity">
        <Avatar className="size-9 border bg-muted/50">
          <AvatarImage src={getGravatarUrl(email)} alt={name} />
          <AvatarFallback className="bg-transparent">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none truncate max-w-[200px]">{name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate max-w-[200px]">{email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
            <Settings className="size-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form id="logout-form" action={signOut} className="hidden" />
        <DropdownMenuItem 
          className="text-left cursor-pointer"
          onClick={() => {
            const form = document.getElementById("logout-form") as HTMLFormElement;
            form?.requestSubmit();
          }}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
