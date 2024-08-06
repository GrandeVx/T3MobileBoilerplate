"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleSignIn = async () => {
    await supabase.auth
      .signInWithPassword({
        email,
        password,
      })
      .then(async (data) => {
        if (!data.data.session) {
          toast({
            variant: "destructive",
            title: "Login Fallito",
            description: "Controlla le credenziali e riprova",
          });
        } else {
          router.push("/dashboard/home");
        }
      });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="flex justify-center"></div>
        <h2 className="mt-6 text-center text-lg font-normal text-gray-900">
          Accedi al tuo account
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="user@example.com"
              className="bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              className="bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link
              href="/forgot-password"
              className="text-sm text-black underline"
            >
              Hai dimenticato la password?
            </Link>
          </div>
          <div className="flex items-center justify-between"></div>
          <Button
            className="w-full rounded-xl bg-foreground"
            onClick={handleSignIn}
          >
            Accedi
          </Button>
        </div>
      </div>
    </div>
  );
}
