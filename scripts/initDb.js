import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from '../src/database/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function initDb() {
  try {
    const sqlPath = path.join(__dirname, '../src/database/banco.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    const statements = sql
      .split(/;\s*$/m)
      .map(s => s.trim())
      .filter(Boolean)

    for (const stmt of statements) {
      console.log('Executando:\n', stmt.slice(0, 80), '...')
      await pool.query(stmt)
    }

    console.log('✅ Banco inicializado com sucesso!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Erro ao inicializar banco:', err)
    process.exit(1)
  }
}

initDb()