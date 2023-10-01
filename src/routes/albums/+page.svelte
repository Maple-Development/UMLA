<script>
  import LargeSongCard from '../../components/large-song-card.svelte';
  import { albums } from '$lib/store.js';
</script>

{#if $albums.length > 0}
<div class="favorites">
  <h1 class="favorites_header">Albums</h1>
  <div class="outer-card">
    {#each $albums as album}
      <LargeSongCard
        title={album.album}
        artist={album.artist}
        albumArt={album.albumArt}
        type="album"
      />
    {/each}
  </div>
</div>
{/if}
