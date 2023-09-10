<script>
  import '../app.postcss';
  let title = 'UMLA';
  import NavBar from '../components/nav-bar.svelte';
  import ControlBar from '../components/control-bar.svelte';
  import FakeCard from '../components/fake-card.svelte';
  import './css/app.css';
  import './css/bottom-bar.css';
  import { afterNavigate } from '$app/navigation';
  import { handle } from '$lib/store.js';
  import { get, set } from 'idb-keyval';
  import { songs } from '$lib/store.js';
  import { albums } from '$lib/store.js';
  import { libLocation } from '$lib/store.js';

  $: location = $libLocation;

  let modal = false;
  $: afterNavigate(({ from }) => {
    if (from == null) {
      startModal();
    } else {
      closeModal();
    }
  });

  async function startModal() {
    if ((await get('file')) === undefined) {
      if (window.location.pathname !== '/upload') {
        window.location.href = '/upload';
        return;
      } else if (window.location.pathname === '/upload') {
        return;
      }
    }
    if (location !== 'local' && location !== undefined) {
      loadExternalLibrary();
      return;
    }
    if (window.location.pathname === '/upload') {
        return;
    }
    modal = true;
  }

  async function closeModal() {
    modal = false;
  }

  async function checkStatus() {
    let handles;
    const fileHandleOrUndefined = await get('file');
    if (fileHandleOrUndefined) {
      handles = fileHandleOrUndefined;
    } else {
      handles = await window.showDirectoryPicker();
      await set('file', d);
    }
    handle.set(handles);
    await verifyPermission($handle);
    await setLibrarySongs($handle);
    await setAlbumSongs();
    closeModal();
  }

  async function setLibrarySongs(handles) {
    const d = await handles.getDirectoryHandle('umla.data');
    const metadata = await d.getFileHandle('songMd.json');
    const file = await metadata.getFile();
    const contents = await file.text();
    const json = JSON.parse(contents);
    let songData = await getSongImages(handles, json.songMd);
    songs.set(songData);
  }

  async function setAlbumSongs() {
    const albumMap = {};

    $songs.forEach((song) => {
      const album = song.album;
      const artist = song.artist;
      const track = song.track;
      const albumArt = song.albumArt;

      if (!(album in albumMap)) {
        albumMap[album] = {
          album,
          artist,
          albumArt,
          tracks: [],
        };
      }

      albumMap[album].tracks.push({
        track,
        albumArt,
      });
    });

    albums.set(
      Object.values(albumMap).filter((album) => album.tracks.length > 1),
    );
  }

  async function loadExternalLibrary() {
    const response = await fetch(location + '/umla.data/songMd.json');
    const json = await response.json();
    let songData = await getExternalSongImages(location, json.songMd);
    songs.set(songData);
    await setAlbumSongs();
  }

  async function getExternalSongImages(location, json) {
    const songs = json;
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      const response = await fetch(
        location + '/umla.data/' + song.id + '.umla',
      );
      const albumArt = await response.text();
      song.albumArt = albumArt;
    }
    return songs;
  }

  async function getSongImages(handle, json) {
    const songs = json;
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i];
      const d = await handle.getDirectoryHandle('umla.data');
      const songHandle = await d.getFileHandle(song.id + '.umla');
      const songFile = await songHandle.getFile();
      const songContents = await songFile.text();
      song.albumArt = songContents;
    }
    return songs;
  }

  async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = 'readwrite';
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }
</script>

<head>
  <title>{title}</title>
</head>

<NavBar />
<slot />
{#if modal == true}
  <div class="welcome4">
    <div class="welcome5">
      <h1>Welcome!</h1>
      <p>Click the button below to refresh your library</p>
      <p class="small1">
        Tip: You can click the refresh button in the top right at any time!
      </p>
      <button on:click={checkStatus}>Refresh Library</button>
    </div>
  </div>
  <div class="blur">
    <FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard
    /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard
    /><FakeCard /><FakeCard /><FakeCard /><FakeCard />
  </div>
{/if}
<br /><br /><br /><br />
<ControlBar />

<style>
  .welcome4 {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
  }

  .welcome5 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000;
    padding: 20px;
    border-radius: 20px;
    border: 2px solid #81f0ff;
  }

  .blur {
    display: flex;
    flex-wrap: wrap;
    margin-left: 1vw;
  }

  .welcome4 h1 {
    font-family: Ubuntu;
    font-size: 50px;
    color: #81f0ff;
    margin-bottom: 0;
  }

  .welcome4 p {
    font-size: 20px;
    color: white;
    margin-top: 5px;
  }

  .welcome4 button {
    width: 200px;
    height: 50px;
    border-radius: 54px;
    background: #1a1b23;
    margin-top: 25px;
    color: white;
    border: none;
    text-align: center;
  }

  .welcome4 button:hover {
    cursor: pointer;
  }

  .small1 {
    font-size: 12px !important;
    color: #8e8e8e !important;
  }
</style>
