<script lang="ts">
    import type { Post } from "$lib/$types";
    export let message: Post;

    function formatTimestamp(timestamp: number): string {
        const date = new Date(timestamp);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            });
        }
    }
</script>

<div class="p-4 m-4 rounded-lg bg-gray-700">
    <p class="text-xl font-bold text-white break-all">
        {message.content}
    </p>
    <small class="text-sm text-gray-300 italic"
        >{formatTimestamp(message.timestamp)}</small
    >
</div>
