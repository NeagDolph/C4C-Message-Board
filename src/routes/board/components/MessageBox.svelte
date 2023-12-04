<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let message = "";
    export let reloading: boolean;

    $: messageTyped = message.trim() !== "";

    function sendMessage() {
        if (messageTyped) {
            dispatch("send", message);
            message = "";
        }
    }

    function reloadMessages() {
        dispatch("reload", 0);
    }
</script>

<div class="flex items-center p-4 bg-gray-800 rounded-md">
    <form on:submit|preventDefault={sendMessage} class="flex-grow flex">
        <input
            bind:value={message}
            class="flex-grow p-2 mr-2 bg-gray-700 rounded-md shadow-sm outline-none focus:outline-orange-500"
            type="text"
            placeholder="Type your message here..."
            maxlength="128"
        />
        <button
            on:click={sendMessage}
            class="px-4 py-2 mr-2 text-white rounded-md shadow-sm {messageTyped &&
                'active:bg-blue-600'}"
            class:bg-blue-500={messageTyped}
            class:bg-gray-500={!messageTyped}
            disabled={!messageTyped}
        >
            Send
        </button>
    </form>

    <button
        on:click={reloadMessages}
        class="px-4 py-2 text-white rounded-md shadow-sm"
        disabled={reloading}
        class:bg-blue-500={!reloading}
        class:bg-gray-500={reloading}
    >
        <i class="fa-solid fa-arrows-rotate" class:rotating={reloading}></i>
    </button>
</div>

<style>
    .rotating {
        animation: rotation 2s infinite linear;
    }

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }
</style>
