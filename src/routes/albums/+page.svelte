<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import { songs } from "$lib/store.js";
    import { albums } from "$lib/store.js";

async function addAlbums() {
  const albumMap = {};

  $songs.forEach(song => {
    const album = song.album;
    const artist = song.artist;
    const track = song.track;
    const albumArt = song.albumArt;

    if (!(album in albumMap)) {
      albumMap[album] = {
        album,
        artist,
        albumArt,
        tracks: []
      };
    }

    albumMap[album].tracks.push({
      track,
      albumArt
    });
  });

  albums.set(Object.values(albumMap).filter(album => album.tracks.length > 1));
}

</script>

{#if $albums.length > 0}
<div class="outer-card">
  {#each $albums as album}
      <LargeSongCard title={album.album} artist={album.artist} albumArt={album.albumArt} type="album" />
  {/each}
</div>
{:else}
  <div class="welcome">
    <h1>Hmmm</h1>
    <p>It seems like you haven't set up the Albums feature yet.</p>
    <p class="small">Click the button below to start setup.</p>
    <button on:click={addAlbums}>Setup albums</button>
  </div>
{/if}
<style>
    .welcome {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 70vh;
        margin-left: auto;
        margin-right: auto;
    }

    .welcome h1 {
        font-family: Ubuntu;
        font-size: 50px;
        color: #81F0FF;
        margin-bottom: 0;
    }

    .welcome p {
        font-size: 20px;
        color: white;
        margin-top: 5px;
    }

    .welcome button {
        width: 200px;
        height: 50px;
        border-radius: 54px;
        background: #1A1B23;
        margin-top: 25px;
        color: white;
        border: none;
        text-align: center;
    }

    .welcome button:hover {
        cursor: pointer;
    }

    .small {
        font-size: 12px !important;
        color: #8E8E8E !important;
    }
</style>