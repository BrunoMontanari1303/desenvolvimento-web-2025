import jwt from 'jsonwebtoken'

const ROLE_CODES = {
  ADMIN: 1,
  USER: 2,
  GESTOR: 3,
}

const ROLE_NAMES = {
  1: 'ADMIN',
  2: 'USER',
  3: 'GESTOR',
}

function normalizeRoleName(value) {
  if (typeof value === 'number') {
    return ROLE_NAMES[value] || null
  }

  const key = String(value || '').trim().toUpperCase()
  if (ROLE_CODES[key]) {
    return key
  }

  const asNum = Number(value)
  if (!Number.isNaN(asNum)) {
    return ROLE_NAMES[asNum] || null
  }

  return null
}

function getRoleNameFromToken(roleFromToken) {
  return normalizeRoleName(roleFromToken) || 'USER'
}

function normalizeAllowedRoles(allowedRoles) {
  return allowedRoles
    .map(normalizeRoleName)
    .filter(Boolean)
}


export function ensureAuth(allowedRoles = []) {
  const normalizedAllowed = normalizeAllowedRoles(allowedRoles)

  return (req, res, next) => {
    const authHeader = req.headers.authorization || ''
    const [scheme, token] = authHeader.split(' ')

    if (!token || scheme !== 'Bearer') {
      return res.status(401).json({
        status: 'error',
        message: 'Token não informado. Faça login novamente.',
      })
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      )

      const roleName = getRoleNameFromToken(decoded.role)

      // Deixa o usuário disponível pros controllers/serviços
      req.user = {
        id: decoded.sub,        // ID do usuário
        role: roleName,         // "ADMIN" | "USER" | "GESTOR"
        rawRole: decoded.role,  // o que veio no token (número)
      }

      // Se tiver lista de papéis exigidos, valida
      if (
        normalizedAllowed.length > 0 &&
        !normalizedAllowed.includes(roleName)
      ) {
        return res.status(403).json({
          status: 'error',
          message: 'Você não tem permissão para acessar este recurso.',
        })
      }

      return next()
    } catch (err) {
      console.error('[AUTH] Erro ao validar token:', err?.message || err)
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido ou expirado. Faça login novamente.',
      })
    }
  }
}