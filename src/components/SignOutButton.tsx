"use client";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

function SignOutButton({ className }: { className: string }) {
  return (
    <Button
      variant="ghost"
      className={cn("", className)}
      onClick={() => signOut({callbackUrl:'/login'})}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}

export default SignOutButton;
