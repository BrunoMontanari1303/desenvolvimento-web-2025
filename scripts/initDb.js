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
      if (!stmt) continue

      console.log('\n▶ Executando:\n', stmt.slice(0, 120), '...')

      try {
        await pool.query(stmt)
      } catch (err) {
        if (err.code === '42P07' || err.code === '42710' || /already exists/i.test(err.message)) {
          console.warn('⚠️ Objeto já existe, ignorando e seguindo.')
          continue
        }

        console.error('❌ Erro neste comando:', err.message)
        throw err
      }
    }

    console.log('\n✅ Banco inicializado/atualizado com sucesso!')
    process.exit(0)
  } catch (err) {
    console.error('\n❌ Erro ao inicializar banco:', err)
    process.exit(1)
  }
}

initDb()