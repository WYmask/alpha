export function log(str: string) {
  process.stderr.write(`[alpharadar] ${str}\n`);
}
