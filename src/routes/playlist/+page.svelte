<script>
  import LargeSongCard from '../../components/large-song-card.svelte';
  import { playlists } from '$lib/store.js';
  import { songs } from '$lib/store.js';
  import { browser } from '$app/environment';
  let playlistName;
  if (browser) {
    let params = new URLSearchParams(document.location.search);
    playlistName = params.get('playlist');
  }
  let playlistSongs = [];
  let showSongs = [];

  $: {
    showSongs = [];
    $playlists.forEach((playlist) => {
      if (playlist.title === playlistName) {
        playlistSongs = playlist.songs;
        $songs.forEach((song) => {
          if (playlistSongs.includes(song.id)) {
            showSongs.push(song);
          }
        });
      }
    });
  }
</script>

{#if playlistName}
  <div class="outer-card">
    {#each showSongs as song (song.id)}
      <LargeSongCard
        title={song.title}
        artist={song.artist}
        albumArt={song.albumArt}
        fileName={song.fileName}
      />
    {/each}
  </div>
{:else}
  <h1>Playlist not found</h1>
{/if}

<style>
</style>
