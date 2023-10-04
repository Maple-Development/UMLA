<script>
  import Track from '../../components/Track.svelte';
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
let playlistInfo = [];
let playlistId;

$: {
  showSongs = [];
  $playlists.forEach((playlist) => {
    playlist.sources.forEach((source) => {
      playlistSongs = playlistSongs.concat(source.songs);
    });
    playlist.songs = playlistSongs;
    $songs.forEach((song) => {
      const isSongIncluded = showSongs.some((showSong) => showSong.id === song.id);
      if (!isSongIncluded && playlistSongs.includes(song.id)) {
        showSongs.push({
          ...song,
        });
      }
    });
    if (playlist.title === playlistName) {
      playlistId = playlist.title;
      playlistInfo = playlist;
    }
    playlistSongs = []; // Reset playlistSongs for the next iteration
  });
  if (browser) {
    console.log(showSongs);
  }
}
</script>

{#if playlistName}
<div class="album_bar">
  <div>
    <img class="album_big" src={playlistInfo.playlistArt} alt="album art" />
  </div>
  <div>
    <h1 class="playlist_title">{playlistInfo.title}</h1>
    <h2 class="playlist_artist">You</h2>
  </div>
</div>
<div class="favorites-alt">
  <div class="outer-track">
    <div class="top-track">
      <div style="display: flex;"><h1 class="track-text ml-14">#</h1> <h1 class="track-text ml-4">Title</h1></div> <h1 style="margin-right: 80px;" class="track-text">O</h1>
    </div>
    {#each showSongs as song, i (i)}
    <div class="flex ml-8 items-center hov-container">
      <div class="mr-4 ml-4">
        <h1 style="text-align: right;" class="track-text w-6">{i + 1}</h1>
      </div>
      <Track
        title={song.title}
        artist={song.artist}
        albumArt={song.albumArt}
        fileName={song.fileName}
        type="p-song"
        id={song.id}
        typeId={playlistId}
      />
    </div>
  {/each}
  </div>
</div>
{:else}
  <h1>Playlist not found</h1>
{/if}