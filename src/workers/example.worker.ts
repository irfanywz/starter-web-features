/**
 * Contoh Web Worker: pekerjaan berat dipindah dari thread UI.
 * Dipanggil dengan import khusus supaya ikut ter-bundle ke satu file:
 *   import ExampleWorker from "@/workers/example.worker.ts?worker&inline";
 */
export interface SumRequest {
  type: "sum";
  numbers: number[];
}

export interface SumResponse {
  type: "sum";
  result: number;
}

self.onmessage = (event: MessageEvent<SumRequest>) => {
  const { numbers } = event.data;
  const result = numbers.reduce((total, n) => total + n, 0);
  const response: SumResponse = { type: "sum", result };
  self.postMessage(response);
};
