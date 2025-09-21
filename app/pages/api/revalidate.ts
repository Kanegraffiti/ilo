import type { NextApiRequest, NextApiResponse } from 'next'

type RevalidateResult = {
  path: string
  revalidated: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ results: RevalidateResult[] } | { message: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const secret = req.query.secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const paths = collectPaths(req)
  if (paths.length === 0) {
    return res.status(400).json({ message: 'No paths provided' })
  }

  const results: RevalidateResult[] = []
  for (const path of paths) {
    try {
      await res.revalidate(path)
      results.push({ path, revalidated: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      results.push({ path, revalidated: false, error: message })
    }
  }

  return res.status(200).json({ results })
}

function collectPaths(req: NextApiRequest): string[] {
  const paths: string[] = []
  const queryPath = req.query.path
  if (typeof queryPath === 'string') {
    paths.push(queryPath)
  } else if (Array.isArray(queryPath)) {
    paths.push(...queryPath)
  }

  const body = req.body
  if (body && typeof body === 'object') {
    const bodyPaths = Array.isArray(body.paths)
      ? body.paths
      : typeof body.path === 'string'
        ? [body.path]
        : []
    for (const p of bodyPaths) {
      if (typeof p === 'string') {
        paths.push(p)
      }
    }
  }

  return [...new Set(paths.filter(Boolean))]
}
