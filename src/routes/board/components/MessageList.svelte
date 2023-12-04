<script lang="ts">
    import {
        onDestroy,
        onMount,
        createEventDispatcher,
        afterUpdate,
    } from "svelte";
    import type { Post, Schema } from "$lib/$types";
    import Message from "./Message.svelte";
    import { posts } from "$lib/stores/posts";

    const dispatch = createEventDispatcher();

    let loadMoreTrigger: HTMLElement;
    let observer: IntersectionObserver;

    onMount(() => {
        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Load more messages when the loadMoreTrigger is in view
                    console.log("intersecting");
                    dispatch("reload", $posts.length);
                }
            },
            { threshold: 1.0 }
        );

        observer.observe(loadMoreTrigger);
    });

    afterUpdate(() => {
        // Re-observe the trigger after the DOM updates
        observer.unobserve(loadMoreTrigger);
        observer.observe(loadMoreTrigger);
    });

    onDestroy(() => {
        if (observer) {
            observer.disconnect();
        }
    });

    $: sortedPosts = $posts.sort((a, b) => b.timestamp - a.timestamp);
</script>

{#each sortedPosts as message}
    <Message {message} />
{/each}
<div bind:this={loadMoreTrigger}></div>
