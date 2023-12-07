<script>
  import LargeSongCard from '../../components/large-song-card.svelte';
  import MiniSongCard from '../../components/mini-song-card.svelte';
  import Track from '../../components/Track.svelte';
  import './library.css'

  import { songs, playlists } from '$lib/store.js';
</script>
<div class="card-container">
<LargeSongCard
  fileName="real.lol"
  title="me when amogus go brr fr fr sussy ohio guzzle juice"
  artist="the skibidi crusaders"
  albumArt="/assets/album_art_placeholder.png"
  type="song"
/>

<LargeSongCard
  fileName="real.lol"
  title="me when amogus go brr fr fr sussy ohio guzzle juice"
  artist="the skibidi crusaders"
  albumArt="/assets/album_art_placeholder.png"
  type="song"
/>
</div>

<div class="mini-card-container">
<MiniSongCard
  fileName="real.lol"
  title="me when amogus go brr fr fr sussy ohio guzzle juice"
  artist="the skibidi crusaders"
  albumArt="/assets/album_art_placeholder.png"
  type="song"
/>

<MiniSongCard
  fileName="real.lol"
  title="me when amogus go brr fr fr sussy ohio guzzle juice"
  artist="the skibidi crusaders"
  albumArt="/assets/album_art_placeholder.png"
  type="song"
/>
</div>

<div class="favorites-alt">
<div class="outer-track">
  <div class="top-track">
    <div style="display: flex;"><h1 class="track-text ml-14">#</h1> <h1 class="track-text ml-4">Title</h1></div> <h1 style="margin-right: 80px;" class="track-text">|</h1>
  </div>
  <div class="flex ml-8 items-center hov-container">
    <div class="mr-4 ml-4">
      <h1 style="text-align: right;" class="track-text w-6">1</h1>
    </div>
    <Track
      title="UMLA"
      artist="The Devs!!"
      albumArt="/assets/album_art_placeholder.png"
      fileName="real.lol"
      type="a-song"
      id="1"
      typeId="2"
    />
    </div>
    <div class="flex ml-8 items-center hov-container">
      <div class="mr-4 ml-4">
        <h1 style="text-align: right;" class="track-text w-6">1</h1>
      </div>
      <Track
        title="UMLA"
        artist="The Devs!!"
        albumArt="/assets/album_art_placeholder.png"
        fileName="real.lol"
        type="a-song"
        id="1"
        typeId="2"
      />
      </div>
      <div class="flex ml-8 items-center hov-container">
        <div class="mr-4 ml-4">
          <h1 style="text-align: right;" class="track-text w-6">1</h1>
        </div>
        <Track
          title="UMLA"
          artist="The Devs!!"
          albumArt="/assets/album_art_placeholder.png"
          fileName="real.lol"
          type="a-song"
          id="1"
          typeId="2"
        />
        </div>
        <div class="flex ml-8 items-center hov-container">
          <div class="mr-4 ml-4">
            <h1 style="text-align: right;" class="track-text w-6">1</h1>
          </div>
          <Track
            title="UMLA"
            artist="The Devs!!"
            albumArt="/assets/album_art_placeholder.png"
            fileName="real.lol"
            type="a-song"
            id="1"
            typeId="2"
          />
          </div>
</div>
</div>

<!--
{#if $songs && $songs.length > 0}
{#if $playlists.length > 0}
    <div class="favorites">
      <h1 class="favorites_header">Favorite Playlists</h1>
    <div class="outer-card">
        {#each $playlists as playlist}
          <LargeSongCard
            fileName=""
            title={playlist.title}
            artist=""
            albumArt={playlist.playlistArt}
            type="playlist"
          />
        {/each}
      </div>
    </div>
{/if}
{/if}

{#if $songs && $songs.length > 0}
<div class="favorites">
  <h1 class="favorites_header">Recently Added</h1>
<div class="outer-card">
    {#each $songs as song}
      <LargeSongCard
        fileName={song.fileName}
        title={song.title}
        artist={song.artist}
        albumArt={song.albumArt}
        type="song"
        id={song.id}
      />
    {/each}
</div>
</div>
{/if}


<div class="outer-card">
  {#if $songs && $songs.length > 0}
    {#each $songs as song}
      <LargeSongCard
        fileName={song.fileName}
        title={song.title}
        artist={song.artist}
        albumArt={song.albumArt}
        type="song"
        id={song.id}
      />
    {/each}
  {/if}
</div>
-->