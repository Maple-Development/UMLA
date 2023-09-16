<script>
import { artists } from '$lib/store.js';
import LargeSongCard from '../../components/large-song-card.svelte';

</script>

{#if $artists.length > 0}
    {#each $artists as artist}
        <h1>{artist.name}</h1>
        <p>{artist.ids}</p>
    {/each}
{/if}