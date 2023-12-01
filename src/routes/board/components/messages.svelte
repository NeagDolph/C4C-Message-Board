<script lang="ts">
    import { onMount } from "svelte";
    import type { Post, Schema } from "$lib/$types";
    import { posts } from "$lib/stores/posts";

    export let postsData: Post[];

    $: sortedPosts = postsData.sort((a, b) => b.timestamp - a.timestamp);
</script>

{#if posts === undefined}
    <p>Loading Messages...</p>
{:else}
    {#each sortedPosts as message}
        <p>Message: {message.content}</p>
    {/each}
{/if}
