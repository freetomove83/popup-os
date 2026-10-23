import * as React from "react";
import { useLocation } from "wouter";

import { Mark, Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Note } from "@/components/ui/alert";
import { api, session } from "@/lib/api";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ token: string; name: string }>("/admin/login", {
        body: { email, password },
      });
      session.set("admin", r);
      navigate("/admin");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background grid place-items-center px-4">
      <Card className="w-full max-w-[400px] p-7">
        <div className="flex items-center gap-2.5 mb-6">
          <Mark size={36} />
          <div>
            <Wordmark size={18} />
            <div className="text-caption text-muted-foreground font-semibold mt-0.5">관리자 콘솔</div>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-3.5">
          <Field label="이메일">
            <Input
              icon="Mail"
              type="email"
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Field>
          <Field label="비밀번호">
            <Input
              icon="LockKeyhole"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Field>
          {error && (
            <Note tone="danger" compact>
              {error}
            </Note>
          )}
          <Button type="submit" size="lg" block loading={busy} disabled={!email || !password}>
            로그인
          </Button>
        </form>
      </Card>
    </div>
  );
}
