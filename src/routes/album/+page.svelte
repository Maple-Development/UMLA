<script>
    import Track from '../../components/Track.svelte';
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
let albumInfo = [];
let albumId;

$: {
  showSongs = [];
  $albums.forEach((album) => {
    if (album.album === albumName) {
      albumId = album.album;
      albumInfo = album;
      albumSongs = album.ids;

      // Filter and sort songs by track number
      showSongs = $songs
        .filter((song) => albumSongs.includes(song.id))
        .sort((a, b) => {
          const trackA = parseInt(a.track.split('/')[0]);
          const trackB = parseInt(b.track.split('/')[0]);
          return trackA - trackB;
        });
    }
  });
}
  </script>
  
  {#if albumName}
  <div class="album_bar">
    <div>
      <img class="album_big" src={albumInfo.albumArt} alt="album art" />
    </div>
    <div>
      <h1 class="playlist_title">{albumInfo.album}</h1>
      <h2 class="playlist_artist">{albumInfo.artist}</h2>
    </div>
  </div>
  <div class="favorites-alt">
    <div class="outer-track">
      <div class="top-track">
        <div style="display: flex;"><h1 class="track-text ml-14">#</h1> <h1 class="track-text ml-4">Title</h1></div> <h1 style="margin-right: 80px;" class="track-text">|</h1>
      </div>
      {#each showSongs as song, i (song.id)}
      <div class="flex ml-8 items-center hov-container">
        <div class="mr-4 ml-4">
          <h1 style="text-align: right;" class="track-text w-6">{i + 1}</h1>
        </div>
        <Track
          title={song.title}
          artist={song.artist}
          albumArt={song.albumArt}
          fileName={song.fileName}
          type="a-song"
          id={song.id}
          typeId={albumId}
        />
        </div>
      {/each}
    </div>
  </div>
  {:else}
    <h1>Playlist not found</h1>
  {/if}
  
  <style>
  </style>
  