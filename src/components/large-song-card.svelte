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
  export let typeId;
  import '../routes/css/components/large-song-card.css';
  $: location = $libLocation;

  if (type === undefined) {
    type = 'song';
  }
  

  async function handlePlay(fileName, title, id) {
    if (type == 'playlist') {
      handlePlaylist(title);
    }
    if (type == 'album') {
      handleAlbum(title);
    }
    if (location !== 'local' && location !== undefined) {
      let messageData = {
        fileName: fileName,
        title: title,
        id: id,
        type: 'external',
        context: type,
      }
      window.postMessage(messageData, window.location.href);
      return;
    }
    let messageData = {
        fileName: fileName,
        title: title,
        id: id,
        type: 'internal',
        context: type,
        typeId: typeId
      }
      window.postMessage(messageData, window.location.href);
      return;
  }

  function handlePlaylist(title) {
    const url = '/playlist?playlist=' + title;
    goto(url);
  }

  function handleAlbum(title) {
    const url = '/album?album=' + title;
    goto(url);
  }
</script>

<div id={fileName} class="large-card {type}">
  <div class="img_container">
    <img class="album_art" src={albumArt} alt="album art" />
  </div>
  <h1 class="song_title">{title}</h1>
  <h2 class="song_artist">{artist}</h2>
</div>
