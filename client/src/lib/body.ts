/**
 * 신체 조건 구간화.
 * 워커는 정확한 키/체중을 입력하지만, 검카드·검색에는 "구간"으로만 노출한다.
 * (예: 172cm → "170~175cm", 43kg → "40~45kg")
 */
export const HEIGHT_STEP = 5;
export const WEIGHT_STEP = 5;

export function lowerBound(value: number, step = HEIGHT_STEP): number {
  return Math.floor(value / step) * step;
}

export function rangeLabel(value: number, step: number, unit: string): string {
  const lo = lowerBound(value, step);
  return `${lo}~${lo + step}${unit}`;
}

export function heightLabel(cm: number): string {
  return rangeLabel(cm, HEIGHT_STEP, "cm");
}

export function weightLabel(kg: number): string {
  return rangeLabel(kg, WEIGHT_STEP, "kg");
}

/** 값이 [min, max) 구간에 속하는지. */
export function inBucket(value: number, min: number, max: number): boolean {
  return value >= min && value < max;
}

export interface BucketOption {
  value: string;
  label: string;
  min: number;
  max: number;
}

function buildBuckets(
  from: number,
  to: number,
  step: number,
  unit: string,
  allLabel: string,
): BucketOption[] {
  const opts: BucketOption[] = [{ value: "all", label: allLabel, min: -Infinity, max: Infinity }];
  for (let lo = from; lo < to; lo += step) {
    opts.push({ value: `${lo}`, label: `${lo}~${lo + step}${unit}`, min: lo, max: lo + step });
  }
  return opts;
}

export const HEIGHT_OPTIONS = buildBuckets(150, 195, HEIGHT_STEP, "cm", "키 전체");
export const WEIGHT_OPTIONS = buildBuckets(40, 90, WEIGHT_STEP, "kg", "몸무게 전체");

export function findBucket(options: BucketOption[], value: string): BucketOption {
  return options.find(o => o.value === value) ?? options[0];
}
