<script lang="ts">
    import type { Post } from "$lib/$types";
    import type { PageData } from "./$types";
    import MessageList from "./components/MessageList.svelte"; // import the MessageList component
    import MessageBox from "./components/MessageBox.svelte"; // import the MessageBox component
    import { posts } from "$lib/stores/posts";
    import { source } from "sveltekit-sse";
    import { onDestroy, onMount } from "svelte";

    let reloading = false;

    // Data sent from server
    export let data;
    let count = data.count;

    let userId: string;

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

    async function reloadMessages(offset = 0): Promise<void> {
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

    onMount(() => {
        let eventSource = source("/events/messages");

        eventSource.subscribe((rawData: string) => {
            let data;

            try {
                data = JSON.parse(rawData);
            } catch (e) {
                return;
            }

            if (data.userId) {
                userId = data.userId;
            }

            if (data.message) {
                if (data.sender !== data.userId) {
                    posts.update((p) => [...p, data.message]);
                }
            }
        });
    });
</script>

<MessageBox
    on:send={sendMessage}
    on:reload={() => reloadMessages()}
    {reloading}
/>
<MessageList on:reload={(event) => reloadMessages(event.detail)} />
{#if count > 10 && count === $posts.length}
    <p class="text-center">You've reached the end...</p>
{/if}
