// src/lib/api.ts
// All calls from the website to the bot's API server

const API = '' // Vercel proxies /api/* to the VPS

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface Player {
  id: string
  name: string
  portalUsername: string
  level: number
  exp: number
  prestige: number
  isKami: boolean
  class: string
  evolved?: string
  race: string
  guild?: string
  guildName?: string
  rank: string
  str: number; agi: number; int: number; def: number; lck: number
  hp: number; maxHp: number; mp: number; maxMp: number
  Solars: number
  gems: number
  kills: number
  dungeonFloor: number
  equippedTitle?: string
  equipped: Record<string, string>
  skills: string[]
  titles: string[]
  killCounts: Record<string, number>
}

export interface LeaderboardEntry extends Player {
  rank: number
}

export interface ShopItem {
  id: string
  name: string
  emoji: string
  type: string
  slot: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  price: number
  str?: number
  agi?: number
  int?: number
  def?: number
  desc: string
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem('axr_token')
}

function authHeaders() {
  const token = getToken()
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong.')
  return data as T
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export async function login(username: string, password: string): Promise<Player> {
  const res = await fetch(`${API}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const data = await handleResponse<{ token: string; player: Player }>(res)
  localStorage.setItem('axr_token', data.token)
  return data.player
}

export async function forgotPassword(
  username: string,
  code: string,
  newPassword: string
): Promise<void> {
  const res = await fetch(`${API}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, code, newPassword }),
  })
  await handleResponse(res)
}

export function logout() {
  localStorage.removeItem('axr_token')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

// ─── PLAYER ───────────────────────────────────────────────────────────────────
export async function getProfile(): Promise<Player | null> {
  if (!getToken()) return null
  try {
    const res = await fetch(`${API}/api/profile`, { headers: authHeaders() })
    if (res.status === 401) { logout(); return null }
    return handleResponse<Player>(res)
  } catch {
    return null
  }
}

export async function getPlayerByUsername(username: string): Promise<Player | null> {
  try {
    const res = await fetch(`${API}/api/player/${encodeURIComponent(username)}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ─── LEADERBOARD ──────────────────────────────────────────────────────────────
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${API}/api/leaderboard`)
    return handleResponse<LeaderboardEntry[]>(res)
  } catch {
    return []
  }
}

// ─── SHOP ─────────────────────────────────────────────────────────────────────
export async function getShopItems(): Promise<ShopItem[]> {
  try {
    const res = await fetch(`${API}/api/shop/items`)
    return handleResponse<ShopItem[]>(res)
  } catch {
    return []
  }
}

export async function buyItem(itemId: string): Promise<Player> {
  const res = await fetch(`${API}/api/shop/buy`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ itemId }),
  })
  return handleResponse<Player>(res)
}
