<script>;
    import { goto } from '$app/navigation';
    import { libLocation } from '$lib/store.js';
    export let title;
    export let artist;
    export let albumArt;
    export let type;
    export let fileName;
    export let id;
    export let typeId;
    import '../routes/css/components/track.css';
  
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
          typeId: typeId
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
  
  <div id={fileName} class="flex-row flex {type}">
        {#if type == 'p-song'}
        <div class="mr-4 mt-2 mb-2">
            <img class="album_art-alt" src={albumArt} alt="album art" />
        </div>
        {/if}
    <div>
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <h1 on:click={handlePlay(fileName, title, id)} class="song_title-alt">{title}</h1>
        <h2 class="song_artist-alt">{artist}</h2>
    </div>
  </div>
  