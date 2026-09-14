import type { LaborBenchmark } from "../types";

export type { LaborBenchmark };

export type BenchmarkLookup = {
  zipCode: string;
  occupationKey: string;
};

export interface LaborBenchmarkProvider {
  getHourlyBenchmark(input: BenchmarkLookup): Promise<LaborBenchmark>;
}

/**
 * Same contract, resolved synchronously. Only a provider whose data is fully
 * in memory can implement this; the client preview depends on it so the
 * visitor sees numbers while typing, while the server path stays async and
 * provider-agnostic.
 */
export interface SyncLaborBenchmarkProvider extends LaborBenchmarkProvider {
  getHourlyBenchmarkSync(input: BenchmarkLookup): LaborBenchmark;
}
