import { access, rm } from "fs/promises";

export async function fileExists(crxFilePath: string): Promise<boolean> {
  try {
    await access(crxFilePath);
    return true;
  } catch {
    return false;
  }
}

export async function removeDirectoryContents(dirPath: string): Promise<void> {
  if (!(await fileExists(dirPath))) return;
  await rm(dirPath, { recursive: true, force: true });
}
