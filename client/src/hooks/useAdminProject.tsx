import * as React from "react";

import { Select } from "@/components/ui/select";
import type { ProjectListItem } from "@/data/admin";
import { useApi } from "@/lib/api";

/**
 * 운영 화면(프로젝트·스크리닝·계약·출퇴근·정산)이 함께 쓰는 "현재 프로젝트".
 * `?project=` 로 유지되어 메뉴를 옮겨도 같은 현장을 본다. 기본값은 오늘 진행 중인 현장.
 */
export function useAdminProject() {
  const list = useApi<ProjectListItem[]>("/admin/projects");
  const [id, setId] = React.useState(() =>
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("project"),
  );
  const projects = list.data ?? [];
  const current =
    projects.find(p => p.id === id) ??
    projects.find(p => p.active) ??
    projects.find(p => !p.ended) ??
    projects[0];

  const select = React.useCallback((value: string) => {
    setId(value);
    const url = new URL(window.location.href);
    url.searchParams.set("project", value);
    window.history.replaceState(null, "", url.toString());
  }, []);

  return { list, projects, current, select };
}

export function ProjectPicker({ ctx }: { ctx: ReturnType<typeof useAdminProject> }) {
  if (!ctx.current) return null;
  return (
    <Select
      ariaLabel="프로젝트 선택"
      icon="FolderKanban"
      value={ctx.current.id}
      onChange={ctx.select}
      options={ctx.projects.map(p => ({
        value: p.id,
        label: `${p.active ? "● " : p.ended ? "종료 · " : ""}${p.brand} · ${p.title}`,
      }))}
      className="w-[280px]"
    />
  );
}
