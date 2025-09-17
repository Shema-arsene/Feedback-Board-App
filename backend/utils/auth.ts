import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"

export interface JWTPayload {
  id: string
  role?: string
}

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" })
}

export function verifyToken(token?: string): JWTPayload | null {
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    return payload
  } catch (err) {
    return null
  }
}

// helper to read Authorization header from request
export function getTokenFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization") || ""
  if (!auth) return null
  const [type, token] = auth.split(" ")
  if (type !== "Bearer") return null
  return token
}
