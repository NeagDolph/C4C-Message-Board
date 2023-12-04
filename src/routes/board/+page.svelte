<script lang="ts">
    import type { Post } from "$lib/$types";
    import type { PageData } from "./$types";
    import MessageList from "./components/MessageList.svelte"; // import the MessageList component
    import MessageBox from "./components/MessageBox.svelte"; // import the MessageBox component
    import { posts } from "$lib/stores/posts";
    import { source } from "sveltekit-sse";
    import { onDestroy, onMount } from "svelte";

    let value;

    let reloading = false;

    export let data;

    let count = data.count;

    // $: {
    // $value;
    // console.log("VAL", $value);
    // posts.update((p) => [...p, $value]);
    // }

    async function sendMessage(event: CustomEvent) {
        const response = await fetch("/api/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: event.detail }),
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
        value = source("/events/messages");
    });
</script>

<p>poopu{typeof window !== "undefined" && $value}</p>
<MessageBox
    on:send={sendMessage}
    on:reload={() => reloadMessages()}
    {reloading}
/>
<MessageList on:reload={(event) => reloadMessages(event.detail)} />
{#if count > 10 && count === $posts.length}
    <p class="text-center">You've reached the end...</p>
{/if}
