/**
 * Frontrun.pro API 调用模块
 */

const FRONTRUN_API_KEY = process.env.FRONTRUN_API_KEY || '3mJXkDFc6e9ijbj2TgOZhX8U006PUk7W';
const FRONTRUN_BASE_URL = 'https://api.frontrun.pro/api/v1/pro';

/**
 * 获取 Twitter 用户的 KOL 关注数
 * @param twitterHandle Twitter 用户名（不含 @）
 * @returns KOL 关注数，失败返回 null
 */
export async function getKOLFollowers(twitterHandle: string): Promise<number | null> {
  if (!twitterHandle) {
    return null;
  }

  const url = `${FRONTRUN_BASE_URL}/twitter/${twitterHandle}/smart-followers/count`;
  
  const headers = {
    'accept': 'application/json',
    'X-Copilot-Client-Language': 'ZH_CN',
    'X-Copilot-Client-Platform': 'CHROME_EXTENSION',
    'X-Copilot-Client-Version': '1.0.0',
    'Authorization': `Bearer ${FRONTRUN_API_KEY}`
  };

  try {
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error(`Frontrun API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data?.data?.totalCount || null;
  } catch (error) {
    console.error(`Frontrun API request failed:`, error);
    return null;
  }
}
