"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

import { api } from "@/trpc/react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// We need to use the service role key to have the admin role for the supabase client
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseKey);
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const deleteUserAccount = api.user.deleteUserAccount.useMutation();

  const handleRemoveAccount = async () => {
    await deleteUserAccount.mutateAsync().then(async (data) => {
      if (!data) {
        toast({
          variant: "destructive",
          title: "Account non rimosso",
          description: "Si è verificato un errore, riprova più tardi",
        });
        return;
      } else {
        await supabase.auth.signOut().then(() => {
          toast({
            variant: "default",
            title: "Account Rimosso",
            description: "Il tuo account è stato rimosso con successo",
          });
        });
      }
    });
  };

  const handleSubmit = async (e: unknown) => {
    // @ts-expect-error - TS doesn't know e.preventDefault
    e.preventDefault();
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
          const token = data.data.session.access_token;
          document.cookie = `sb-tmp-auth-token=${encodeURIComponent(token)}; path=/;`;
          await handleRemoveAccount()
            .then(() => {
              // clear the cookie
              document.cookie = `sb-tmp-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg"
      >
        <div className="flex justify-center">
          <Image
            src="/icon/ecoffice-big.png"
            alt="Ecoffice Logo"
            width={250}
            height={250}
          />
        </div>
        <h2 className="mt-6 text-center text-lg font-normal text-gray-900">
          Rimuovi il tuo Account
        </h2>
        <p className="text-center text-sm">
          Sei sicuro di voler rimuovere il tuo account? Questa azione è
          irreversibile, una volta effettuato il login procederemo con la
          cancellazione del tuo account in modo permanente.
        </p>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
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
              placeholder="Nuova password"
              className="bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between"></div>
          <Button
            disabled={email === "" || password === ""}
            className="w-full rounded-xl bg-foreground disabled:bg-background "
            type="submit"
          >
            {deleteUserAccount.isLoading
              ? "Rimozione in corso..."
              : "Rimuovi Account"}
          </Button>
        </div>
      </form>
    </div>
  );
}
