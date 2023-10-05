<script>
  import LargeSongCard from '../../components/large-song-card.svelte';
  import { songs, playlists, libLocation } from '$lib/store.js';
  let isMultiLocation = false;
  if ($libLocation.constructor == Array) {
    isMultiLocation = true;
  }
</script>

{#if isMultiLocation}
{#each $songs as songObj}
  {#if songObj && songObj.length > 0}
  {#each $playlists as playlistObj}
  {#if playlistObj.length > 0}
      <div class="favorites">
        <h1 class="favorites_header">Favorite Playlists</h1>
      <div class="outer-card">
          {#each playlistObj as playlist}
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
  {/each}
  {/if}
{/each}
{:else}
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

{#if isMultiLocation}
    {#each $songs as songObj}
      {#if songObj && songObj.length > 0}
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
    {/each}
    {:else}
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
{/if}


<!--
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