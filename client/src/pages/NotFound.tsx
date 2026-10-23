import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-dvh grid place-items-center bg-background px-6">
      <div className="text-center">
        <div className="text-h1 text-ink mb-2">404</div>
        <p className="text-body text-muted-foreground mb-5">
          페이지를 찾을 수 없습니다.
        </p>
        <Link href="/" className="text-[13px] font-bold text-brand-600 hover:underline">
          처음으로 →
        </Link>
      </div>
    </div>
  );
}
