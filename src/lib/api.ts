// src/lib/api.ts
// All calls from the website to the bot's API server

const API = '' // Vercel proxies /api/* to the VPS

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface Player {
  id: string
  name: string
  portalUsername: string
  avatarUrl?: string
  bannerUrl?: string
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
  activityLog?: ActivityEntry[]
}

export interface ActivityEntry {
  text: string
  time: string
  type: string
}

export interface GuildRank {
  name: string
  rank: number
  members: number
  kills: number
  leader?: string
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

// ─── BOT STATS ────────────────────────────────────────────────────────────────
export interface BotStat {
  name: string
  online: boolean
  uptime: string
  ping: number | null
  servers: number | null
  commands: number | null
}

export async function getBotStats(): Promise<BotStat[]> {
  try {
    const res = await fetch(`${API}/api/bots`)
    if (!res.ok) return []
    return handleResponse<BotStat[]>(res)
  } catch {
    return []
  }
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
export async function uploadAvatar(file: File): Promise<Player> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const res = await fetch(`${API}/api/profile/avatar`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
  })
  return handleResponse<Player>(res)
}

// ─── BANNER ───────────────────────────────────────────────────────────────────
export async function uploadBanner(file: File): Promise<Player> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
  const res = await fetch(`${API}/api/profile/banner`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
  })
  return handleResponse<Player>(res)
}

// ─── GUILD RANKS ──────────────────────────────────────────────────────────────
export async function getGuildRanks(): Promise<GuildRank[]> {
  try {
    const res = await fetch(`${API}/api/leaderboard`)
    const players = await handleResponse<LeaderboardEntry[]>(res)
    const map = new Map<string, { kills: number; members: number; name: string; leader: string }>()
    for (const p of players) {
      const gName = p.guildName || p.guild
      if (!gName || gName.startsWith('guild_')) continue
      const entry = map.get(gName) || { kills: 0, members: 0, name: gName, leader: '' }
      entry.kills += p.kills || 0
      entry.members += 1
      if (!entry.leader) entry.leader = p.name
      map.set(gName, entry)
    }
    return Array.from(map.values())
      .sort((a, b) => b.kills - a.kills)
      .map((g, i) => ({ name: g.name, rank: i + 1, members: g.members, kills: g.kills, leader: g.leader }))
  } catch {
    return []
  }
}

// ─── REALM FEED (optional public endpoint; falls back client-side on Home) ───
export async function getRealmFeed(): Promise<string[] | null> {
  try {
    const res = await fetch(`${API}/api/realm-feed`)
    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    if (!data) return null
    if (Array.isArray(data)) {
      return data.map((x: unknown) =>
        typeof x === 'string' ? x : (x as { text?: string }).text || ''
      ).filter(Boolean)
    }
    const items = (data as { items?: unknown[] }).items
    if (Array.isArray(items)) {
      return items.map(x =>
        typeof x === 'string' ? x : (x as { text?: string }).text || ''
      ).filter(Boolean)
    }
    return null
  } catch {
    return null
  }
}

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
export async function getPlayerActivity(): Promise<ActivityEntry[]> {
  if (!getToken()) return []
  try {
    const res = await fetch(`${API}/api/profile/activity`, { headers: authHeaders() })
    if (!res.ok) return []
    return handleResponse<ActivityEntry[]>(res)
  } catch {
    return []
  }
}
