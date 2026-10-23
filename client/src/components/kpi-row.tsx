import { Kpi, type KpiProps } from "@/components/kpi";

export function KpiRow({
  items,
  state = "default",
}: {
  items: KpiProps[];
  state?: "default" | "empty" | "loading" | "error";
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-4">
      {items.map((k, i) => (
        <Kpi
          key={i}
          {...k}
          state={
            state === "loading" ? "loading" : state === "error" ? "error" : "default"
          }
        />
      ))}
    </div>
  );
}

export function zeroKpis(items: KpiProps[]): KpiProps[] {
  return items.map(k => ({
    ...k,
    value: (k as KpiProps & { zero?: string }).zero ?? "0",
    tone: undefined,
    pulse: false,
  }));
}
