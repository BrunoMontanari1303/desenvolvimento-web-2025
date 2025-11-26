import bcrypt from 'bcryptjs'
import { getUserWithHashByEmail } from '../repositories/usuarioRepository.js'

export async function verifyCredentials(email, password) {
  const user = await getUserWithHashByEmail(email)
  if (!user || !user.senha_hash) return null

  const ok = await bcrypt.compare(password, user.senha_hash)
  if (!ok) return null

  // devolve só o que o controller precisa (sem hash)
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    papel: user.papel
  }
}