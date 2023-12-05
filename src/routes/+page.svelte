<script lang="ts">
    import type { Post } from "$lib/$types";
    import MessageList from "./components/MessageList.svelte";
    import MessageBox from "./components/MessageBox.svelte";
    import { posts } from "$lib/stores/posts";
    import { source } from "sveltekit-sse";
    import { onMount } from "svelte";

    let reloading = false;

    // SSE source
    let eventSource;

    // Data sent from server
    export let data;
    let count = data.count;

    // Session ID for server sent events.
    let userId: string;

    // Object format for SSE incoming data.
    interface SSEData {
        userId?: string;
        message?: Post;
        sender?: string;
    }

    async function sendMessage(event: CustomEvent) {
        const response = await fetch("/api/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: event.detail, userId }),
        });

        if (response.ok) {
            const newPost = await response.json();

            // Update total post count
            if (newPost.count) count = newPost.count;

            // Update posts
            posts.update((val) => [...val, newPost.message]);
        }
    }

    async function reloadMessages(): Promise<void> {
        loadMessages(0);
        initSSE();
    }

    async function loadMessages(offset = 0): Promise<void> {
        if (offset >= count) {
            return;
        }

        reloading = true;
        const response = await fetch(
            `/api/get-messages?offset=${offset}&limit=10`
        );

        if (response.ok) {
            const { posts: newPosts, count: newCount } = await response.json();

            // Update total post count
            if (newCount) count = newCount;

            // Update messages, appending if loading past current message count
            posts.update((prev) => {
                if (offset >= prev.length) {
                    return [...prev, ...newPosts];
                } else {
                    return newPosts;
                }
            });

            reloading = false;
        } else {
            alert("Error loading messages!");
            reloading = false;
        }
    }

    function initSSE() {
        if (eventSource !== undefined) eventSource.close();
        eventSource = source("/events");
        eventSource.subscribe((rawData: string) => {
            let data: SSEData;

            try {
                data = JSON.parse(rawData);
            } catch (e) {
                return;
            }

            if (data.userId) {
                userId = data.userId;
            }

            // Check if message sent from self
            if (data.sender !== data.userId && data.message !== undefined) {
                const message: Post = data.message;
                posts.update((p) => [...p, message]);
            }
        });
    }

    onMount(() => {
        initSSE();
    });
</script>

<MessageBox
    on:send={sendMessage}
    on:reload={() => reloadMessages()}
    {reloading}
/>
<MessageList on:reload={(event) => loadMessages(event.detail)} />
{#if count > 10 && count === $posts.length}
    <p class="text-center">You've reached the end...</p>
{/if}
