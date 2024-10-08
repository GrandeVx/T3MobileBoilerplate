"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push("/dashboard/home");
        toast({
          title: "Login effettuato",
          description: "Benvenuto nel tuo account",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Fallito",
        description: "Controlla le credenziali e riprova",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Accedi al tuo account
        </h2>
        <form onSubmit={handleSignIn} className="space-y-6">
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
          </div>
          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-black hover:underline"
            >
              Hai dimenticato la password?
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl bg-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Accesso in corso..." : "Accedi"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm">Non hai un account? </span>
          <Link href="/signup" className="text-sm text-black hover:underline">
            Registrati
          </Link>
        </div>
      </div>
    </div>
  );
}
