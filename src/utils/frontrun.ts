import { type Page } from 'playwright';

const FRONTRUN_API_KEY = '3mJXkDFc6e9ijbj2TgOZhX8U006PUk7W';
const FRONTRUN_API_BASE = 'https://api.frontrun.pro/api/v1/pro';

interface KOLFollowersResponse {
  count?: number;
  data?: {
    smartFollowersCount?: number;
  };
}

/**
 * 获取 Twitter 账号的 KOL 关注数
 * @param twitterHandle Twitter 用户名（如 @Surgexyz_）
 * @returns KOL 关注数，失败返回 null
 */
export async function getKOLFollowers(twitterHandle: string): Promise<number | null> {
  // 清理用户名（移除 @ 符号）
  const username = twitterHandle.replace('@', '').trim();
  
  if (!username) {
    console.log(`[!] 无效的用户名: ${twitterHandle}`);
    return null;
  }

  try {
    console.log(`[*] 查询 ${username} 的 KOL 关注数...`);
    
    const response = await fetch(
      `${FRONTRUN_API_BASE}/twitter/${username}/smart-followers/count`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-Copilot-Client-Language': 'ZH_CN',
          'X-Copilot-Client-Platform': 'CHROME_EXTENSION',
          'X-Copilot-Client-Version': '1.0.0',
          'Authorization': `Bearer ${FRONTRUN_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      console.log(`[!] API 请求失败: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: KOLFollowersResponse = await response.json();
    
    // 解析 KOL 关注数
    const kolCount = data?.data?.smartFollowersCount || data?.count || 0;
    
    console.log(`[*] ${username}: ${kolCount} KOL 关注`);
    return kolCount;
    
  } catch (error) {
    console.error(`[!] 查询 ${username} 失败:`, error);
    return null;
  }
}

/**
 * 批量查询 KOL 关注数
 * @param twitterHandles Twitter 用户名列表
 * @returns 用户名到 KOL 关注数的映射
 */
export async function batchGetKOLFollowers(
  twitterHandles: string[]
): Promise<Map<string, number>> {
  const results = new Map<string, number>();
  
  // 串行查询，避免 API 限流
  for (const handle of twitterHandles) {
    const count = await getKOLFollowers(handle);
    if (count !== null) {
      results.set(handle, count);
    }
    // 添加延迟，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
}
