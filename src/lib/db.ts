import { JSONPreset } from 'lowdb/node'
import type { Post, Schema } from '$lib/$types'

// Read or create db.json
const defaultData: Schema = { posts: [] }
const db = await JSONPreset<Schema>('db.json', defaultData)

export default db;