<script>
  import { audio } from '$lib/store.js';
  import { handle } from '$lib/store.js';
  import { songs } from '$lib/store.js';
  import { currentlyPlaying } from '$lib/store.js';
  import { goto } from '$app/navigation';
  import { libLocation } from '$lib/store.js';
  import { index } from '$lib/store.js'
  import { set } from 'idb-keyval';
  export let title;
  export let artist;
  export let albumArt;
  export let type;
  export let fileName;
  export let id;

  $: location = $libLocation;

  if (type === undefined) {
    type = 'song';
  }
  

  async function handlePlay(fileName, title, id) {
    if (type == 'playlist') {
      handlePlaylist(title);
    }
    if (location !== 'local' && location !== undefined) {
      let messageData = {
        fileName: fileName,
        title: title,
        id: id,
        type: 'external',
      }
      window.postMessage(messageData, window.location.href);
      return;
    }
    let messageData = {
        fileName: fileName,
        title: title,
        id: id,
        type: 'internal',
      }
      window.postMessage(messageData, window.location.href);
      return;
  }

  function handlePlaylist(title) {
    const url = '/playlist?playlist=' + title;
    goto(url);
  }
</script>

<div id={fileName} class="card_vert {type}">
  <div class="img_container">
    <img class="album_art" src={albumArt} alt="album art" />
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <svg
      on:click={handlePlay(fileName, title, id)}
      class="play_hover"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      ><path
        d="M378.5-303 658-480 378.5-658v355ZM480.202-60q-87.109 0-163.755-32.847t-133.713-90.012q-57.067-57.166-89.9-133.539Q60-392.771 60-479.798q0-88.109 32.847-164.755t89.855-133.515q57.009-56.87 133.455-89.901Q392.604-901 479.714-901q88.193 0 164.963 33.085t133.559 89.803q56.789 56.717 89.777 133.268Q901-568.294 901-480.064q0 87.246-33.044 163.876-33.044 76.63-90.013 133.575-56.968 56.946-133.341 89.78Q568.229-60 480.202-60Z"
      /></svg
    >
  </div>
  <h1 class="song_title">{title}</h1>
  <h2 class="song_artist">{artist}</h2>
</div>
