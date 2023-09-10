<script>
    import LargeSongCard from '../../components/large-song-card.svelte';
    import { albums } from '$lib/store.js';
    import { songs } from '$lib/store.js';
    import { browser } from '$app/environment';
    let albumName;
    if (browser) {
      let params = new URLSearchParams(document.location.search);
      albumName = params.get('album');
    }
    let albumSongs = [];
    let showSongs = [];
  
    $: {
      showSongs = [];
      $albums.forEach((album) => {
        if (album.album === albumName) {
            console.log(album);
          albumSongs = album.ids;
          $songs.forEach((song) => {
            if (albumSongs.includes(song.id)) {
              showSongs.push(song);
            }
          });
        }
      });
    }
  </script>
  
  {#if albumName}
    <div class="outer-card">
      {#each showSongs as song (song.id)}
        <LargeSongCard
          title={song.title}
          artist={song.artist}
          albumArt={song.albumArt}
          fileName={song.fileName}
          type="song"
          id={song.id}
        />
      {/each}
    </div>
  {:else}
    <h1>album not found</h1>
  {/if}
  
  <style>
  </style>
  