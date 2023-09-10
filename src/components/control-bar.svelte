<script>
  import { currentlyPlaying } from '$lib/store.js';
  import AudioHandler from './AudioHandler.svelte';
  import { browser } from '$app/environment';
  import { audio } from '$lib/store.js';
  import { handle } from '$lib/store.js';
  import { songs } from '$lib/store.js';
  import { goto } from '$app/navigation';
  import { libLocation } from '$lib/store.js';
  import { index } from '$lib/store.js'

  $: location = $libLocation;
  let audioComponent;

  function pause() {
    let messageData = 'pause';
    window.postMessage(messageData, window.location.href);
  }

  function skip() {
    let song = findSongById($index[2])
      if (song) {
        audioComponent.$destroy();
        playSong(song.fileName, $index[2]);
      }
  }

  function back() {
    let song = findSongById($index[1])
      if (song) {
        audioComponent.$destroy();
        playSong(song.fileName, $index[1]);
      }
  }
  
  async function findSongIndexes(id) {
    let minSong = 1;
    let maxSong = $songs.length;
    let lastSong = id - 1;
    let nextSong = id + 1;

    if (lastSong < minSong) {
      lastSong = maxSong;
    }
    if (nextSong > maxSong) {
      nextSong = minSong;
    }
    index.set([id, lastSong, nextSong]);
  }


  async function playSong(fileName, id) {
    if (audioComponent) {
      audioComponent.$destroy();
    }
    audioComponent = new AudioHandler({ target: document.body });
    const song = await $handle.getFileHandle(fileName);
    const file = await song.getFile();
    const url = URL.createObjectURL(file);
    audio.set(url);
    await findSongIndexes(id);
    setCurrentlyPlaying(fileName);
  }

  async function playExternalSong(fileName, location, id) {
    if (audioComponent) {
      audioComponent.$destroy();
    }
    audioComponent = new AudioHandler({ target: document.body });
    const song = await fetch(location + '/' + fileName);
    const file = await song.blob();
    const url = URL.createObjectURL(file);
    audio.set(url);
    await findSongIndexes(id);
    setCurrentlyPlaying(fileName);
  }

  function findSongById(id) {
    return $songs.find((song) => song.id === id);
  }

  if (browser) {
      window.addEventListener('message', (event) => {
        // Check the origin of the message (optional)
        if (event.origin !== window.location.origin) {
            return;
        }

        const data = event.data;
        if (!data.fileName) {
          return;
        }
        if (data.type == 'external') {
          playExternalSong(data.fileName, location, data.id);
        } else {
          playSong(data.fileName, data.id);
        }
        
    }); 

    window.addEventListener('message', (event) => {
        // Check the origin of the message (optional)
        if (event.origin !== window.location.origin) {
            return;
        }

        const data = event.data;
        if (data !== 'ended') {
          return;
        }

        let song = findSongById($index[2])
        if (song) {
          audioComponent.$destroy();
          playSong(song.fileName, $index[2]);
        }
    }); 
  }

  async function setCurrentlyPlaying(fileName) {
    const song = $songs.find((song) => song.fileName === fileName);
    currentlyPlaying.set(song);
  }
</script>

<div class="control-bar">
  <div class="control_container">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="back_button" on:click={back}>
      <svg viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Frame">
          <path
            id="Vector"
            d="M23.4062 27.5375C24.2375 28.0312 25.4013 28.1437 26.39 27.8125C27.3788 27.4812 28 26.775 28 26V5.99999C28 5.22499 27.37 4.51874 26.39 4.18749C25.41 3.85624 24.2462 3.96249 23.4062 4.46249L6.60625 14.4625L5.6 15.0625V5.99999C5.6 4.89374 4.34875 3.99999 2.8 3.99999C1.25125 3.99999 0 4.89374 0 5.99999V26C0 27.1062 1.25125 28 2.8 28C4.34875 28 5.6 27.1062 5.6 26V16.9375L6.60625 17.5375L23.4062 27.5375Z"
            fill="white"
          />
        </g>
      </svg>
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="pause_button" on:click={pause}>
      <svg
        width="31"
        height="36"
        viewBox="0 0 31 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="Vector"
          d="M4.65 0C2.08281 0 0 2.01562 0 4.5V31.5C0 33.9844 2.08281 36 4.65 36H7.75C10.3172 36 12.4 33.9844 12.4 31.5V4.5C12.4 2.01562 10.3172 0 7.75 0H4.65ZM23.25 0C20.6828 0 18.6 2.01562 18.6 4.5V31.5C18.6 33.9844 20.6828 36 23.25 36H26.35C28.9172 36 31 33.9844 31 31.5V4.5C31 2.01562 28.9172 0 26.35 0H23.25Z"
          fill="white"
        />
      </svg>
    </div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="forward_button" on:click={skip}>
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame">
          <path
            id="Vector"
            d="M4.59375 27.5375C3.7625 28.0312 2.59875 28.1437 1.61 27.8125C0.62125 27.4812 0 26.775 0 26V5.99999C0 5.22499 0.63 4.51874 1.61 4.18749C2.59 3.85624 3.75375 3.96249 4.59375 4.46249L21.3937 14.4625L22.4 15.0625V5.99999C22.4 4.89374 23.6512 3.99999 25.2 3.99999C26.7487 3.99999 28 4.89374 28 5.99999V26C28 27.1062 26.7487 28 25.2 28C23.6512 28 22.4 27.1062 22.4 26V16.9375L21.3937 17.5375L4.59375 27.5375Z"
            fill="white"
          />
        </g>
      </svg>
    </div>
    <div class="shuffle_button">
      <svg
        width="25"
        height="28"
        viewBox="0 0 25 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame" clip-path="url(#clip0_215_14)">
          <path
            id="Vector"
            d="M19.7168 1.88124C20.3027 1.60781 20.9717 1.76093 21.4209 2.25859L24.5459 5.75859C24.8389 6.08671 25.0049 6.52968 25.0049 6.99452C25.0049 7.45937 24.8389 7.90234 24.5459 8.23046L21.4209 11.7305C20.9717 12.2336 20.3027 12.3812 19.7168 12.1078C19.1309 11.8344 18.75 11.2 18.75 10.4891V8.74999H17.1875C16.6943 8.74999 16.2305 9.00702 15.9375 9.44999L13.8672 12.5398L11.9141 9.62499L13.4375 7.34999C14.3213 6.02655 15.7129 5.24999 17.1875 5.24999H18.75V3.49999C18.75 2.79452 19.1309 2.15468 19.7168 1.88124ZM8.00781 15.4601L9.96094 18.375L8.4375 20.65C7.55371 21.9734 6.16211 22.75 4.6875 22.75H1.5625C0.698242 22.75 0 21.968 0 21C0 20.032 0.698242 19.25 1.5625 19.25H4.6875C5.18066 19.25 5.64453 18.993 5.9375 18.55L8.00781 15.4601ZM21.416 25.7414C20.9668 26.2445 20.2979 26.3922 19.7119 26.1187C19.126 25.8453 18.7451 25.2109 18.7451 24.5V22.75H17.1875C15.7129 22.75 14.3213 21.9734 13.4375 20.65L5.9375 9.44999C5.64453 9.00702 5.18066 8.74999 4.6875 8.74999H1.5625C0.698242 8.74999 0 7.96796 0 6.99999C0 6.03202 0.698242 5.24999 1.5625 5.24999H4.6875C6.16211 5.24999 7.55371 6.02655 8.4375 7.34999L15.9375 18.55C16.2305 18.993 16.6943 19.25 17.1875 19.25H18.75V17.5C18.75 16.7945 19.1309 16.1547 19.7168 15.8812C20.3027 15.6078 20.9717 15.7609 21.4209 16.2586L24.5459 19.7586C24.8389 20.0867 25.0049 20.5297 25.0049 20.9945C25.0049 21.4594 24.8389 21.9023 24.5459 22.2305L21.4209 25.7305L21.416 25.7414Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_215_14">
            <rect width="25" height="28" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <div class="loop_button">
      <svg
        width="25"
        height="28"
        viewBox="0 0 25 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame" clip-path="url(#clip0_215_12)">
          <path
            id="Vector"
            d="M0 12.2488C0 13.2168 0.698242 13.9988 1.5625 13.9988C2.42676 13.9988 3.125 13.2168 3.125 12.2488C3.125 9.35035 5.22461 6.99878 7.8125 6.99878H15.625V8.74879C15.625 9.45425 16.0059 10.0941 16.5918 10.3675C17.1777 10.641 17.8467 10.4878 18.2959 9.99019L21.4209 6.49019C22.0313 5.8066 22.0313 4.69644 21.4209 4.01285L18.2959 0.512847C17.8467 0.0097222 17.1777 -0.137934 16.5918 0.135503C16.0059 0.408941 15.625 1.04332 15.625 1.74878V3.49878H7.8125C3.49609 3.49878 0 7.41441 0 12.2488ZM25 15.7488C25 14.7808 24.3018 13.9988 23.4375 13.9988C22.5732 13.9988 21.875 14.7808 21.875 15.7488C21.875 18.6472 19.7754 20.9988 17.1875 20.9988H9.375V19.2488C9.375 18.5433 8.99414 17.9035 8.4082 17.63C7.82227 17.3566 7.15332 17.5097 6.7041 18.0074L3.5791 21.5074C2.96875 22.191 2.96875 23.3011 3.5791 23.9847L6.7041 27.4847C7.15332 27.9878 7.82227 28.1355 8.4082 27.8621C8.99414 27.5886 9.375 26.9543 9.375 26.2433V24.4988H17.1875C21.5039 24.4988 25 20.5832 25 15.7488Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_215_12">
            <rect width="25" height="28" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  </div>

  {#if $currentlyPlaying != null}
    <div class="song_info">
      <img
        class="album_photo"
        src={$currentlyPlaying.albumArt}
        alt="album art"
      />
      <div class="song_md">
        <div class="song_title_vert">{$currentlyPlaying.title}</div>
        <div class="song_artist_vert">{$currentlyPlaying.artist}</div>
      </div>
    </div>
  {/if}

  <div class="volume_container">
    <div class="volume_button">
      <svg viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          id="Vector"
          d="M15.6837 0.148973C16.2827 0.42754 16.6681 1.03825 16.6681 1.71324V22.2844C16.6681 22.9594 16.2827 23.5701 15.6837 23.8487C15.0846 24.1272 14.3815 24.0147 13.8918 23.5647L6.86518 17.1416H3.33362C1.49492 17.1416 0 15.6041 0 13.7131V10.2846C0 8.39351 1.49492 6.85603 3.33362 6.85603H6.86518L13.8918 0.432897C14.3815 -0.0170967 15.0846 -0.124238 15.6837 0.148973ZM22.1373 7.23102L25.0022 10.1774L27.867 7.23102C28.3566 6.72746 29.1484 6.72746 29.6328 7.23102C30.1172 7.73459 30.1224 8.54886 29.6328 9.04707L26.7679 11.9935L29.6328 14.9398C30.1224 15.4434 30.1224 16.2577 29.6328 16.7559C29.1432 17.2541 28.3514 17.2595 27.867 16.7559L25.0022 13.8095L22.1373 16.7559C21.6477 17.2595 20.856 17.2595 20.3716 16.7559C19.8871 16.2523 19.8819 15.4381 20.3716 14.9398L23.2364 11.9935L20.3716 9.04707C19.8819 8.5435 19.8819 7.72923 20.3716 7.23102C20.8612 6.73282 21.6529 6.72746 22.1373 7.23102Z"
          fill="white"
        />
      </svg>
    </div>
    <input type="range" min="1" max="100" value="50" class="volume_slider" />
  </div>
</div>