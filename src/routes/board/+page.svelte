<script lang="ts">
    import type { Post } from "$lib/$types";
    import type { PageData } from "./$types";
    import Messages from "./components/messages.svelte";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    export let data: PageData;

    let inputValue: string;

    async function sendMessage() {
        const response = await fetch("/api/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputValue),
        });

        if (response.ok) {
            const newPost = await response.json();
            data.props.posts = [...data.props.posts, newPost.message];
            inputValue = "";
        }
    }
</script>

<input bind:value={inputValue} /><br />
<button on:click={sendMessage}>Send Message</button>
<Messages postsData={data.props.posts} />
