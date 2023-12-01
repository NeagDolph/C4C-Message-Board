import { writable } from 'svelte/store';
import type { Post } from '$lib/$types'

export const posts = writable<Post[]>([]);