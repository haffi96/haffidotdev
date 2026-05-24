import { authClient } from "#/lib/auth-client";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { Field } from "#/components/Field";
import { Input } from "#/components/ui/input";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login
});

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result =
      mode === "signin"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ name: name || email, email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message || "Authentication failed.");
      return;
    }

    await navigate({ to: "/app" });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 py-10 text-slate-950">
      <Card className="w-full max-w-md border-amber-300 shadow-[10px_10px_0_#fcd34d]">
        <CardHeader>
          <CardTitle>{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
          <CardDescription>Use email/password or Google OAuth. Google credentials are read from Cloudflare secrets.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            {mode === "signup" ? (
              <Field label="Name">
                <Input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
              </Field>
            ) : null}
            <Field label="Email">
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            </Field>
            <Field label="Password">
              <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "signin" ? "current-password" : "new-password"} required />
            </Field>
            {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}</Button>
          </form>
          <Button
            type="button"
            variant="outline"
            className="mt-3 w-full"
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/app" })}
          >
            Continue with Google
          </Button>
          <div className="mt-5 flex items-center justify-between text-sm">
            <button type="button" className="font-semibold text-slate-700 underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
              {mode === "signin" ? "Need an account?" : "Already have an account?"}
            </button>
            <Link to="/" className="text-slate-500 hover:text-slate-950">Home</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
