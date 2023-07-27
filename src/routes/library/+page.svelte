<script>
  import LargeSongCard from '../../components/large-song-card.svelte';
  import { songs } from '$lib/store.js';
</script>

<div class="outer-card">
  {#if $songs && $songs.length > 0}
    {#each $songs as song}
      <LargeSongCard
        fileName={song.fileName}
        title={song.title}
        artist={song.artist}
        albumArt={song.albumArt}
        type="song"
      />
    {/each}
  {/if}
</div>
