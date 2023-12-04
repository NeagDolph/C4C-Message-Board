import { JSONPreset } from 'lowdb/node'
import type { Post, Schema } from '$lib/$types'
import lodash from 'lodash'

// Read or create db.json
const defaultData: Schema = { posts: [], users: [] }
const db = await JSONPreset<Schema>('db.json', defaultData)

// Create a lodash chain to manipulate the data
const users = lodash.chain(db.data.users)
const posts = lodash.chain(db.data.posts)

export { db, users, posts }