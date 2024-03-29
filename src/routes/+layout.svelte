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
  import { libLocation, artists, playlists } from '$lib/store.js';

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
      if (window.location.pathname === '/settings') {
        return;
      }
      if (window.location.pathname !== '/upload') {
        window.location.href = '/upload';
        return;
      } else if (window.location.pathname === '/upload') {
        return;
      }
    }
    if (window.location.pathname === '/settings') {
        return;
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
    await setArtists();
    await loadPlaylists($handle);
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

  async function loadPlaylists(handle) {
    const d = await handle.getDirectoryHandle('umla.data');
    const pdir = await d.getDirectoryHandle('playlist.data');
    const p = await pdir.getFileHandle('playlist.md');
    const file = await p.getFile();
    const contents = await file.text();
    if (contents) {
    const json = JSON.parse(contents);
    let playlistData = await loadPlaylistImages(pdir, json);
    console.log(playlistData);
    playlists.set(playlistData);
    } else {
      playlists.set([]);
    }
  }

  async function loadPlaylistImages(handle, json) {
    const playlists = json;
    let f = 0;
    for (let i = 0; i < playlists.length; i++) {
      f++;
      const playlist = playlists[i];
      const artHandle = await handle.getFileHandle(f + '.umla');
      const file = await artHandle.getFile();
      const contents = await file.text();
      const image = contents;
      playlist.playlistArt = image;
    }
    return playlists;
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
        ids: [],
      };
    }

    // Extract the track number from the "num/totaltracks" format
    const trackNumber = parseInt(track.split('/')[0]);

    albumMap[album].tracks.push({
      track: trackNumber,
      albumArt,
    });

    albumMap[album].ids.push(song.id);
  });

  // Sort the tracks within each album by track number
  Object.values(albumMap).forEach((album) => {
    album.tracks.sort((a, b) => a.track - b.track);
  });

  albums.set(
    Object.values(albumMap).filter((album) => album.tracks.length > 1),
  );
}
  async function setArtists() {
    const artistsMap = {};

    $songs.forEach((song) => {
      const artist = song.artist;
      if (!(artist in artistsMap)) {
        artistsMap[artist] = {
          name: artist,
          albumArt: '',
          ids: [],
        };
      }
      artistsMap[artist].ids.push(song.id);
    });

    artists.set(Object.values(artistsMap));
  }

  async function loadExternalPlaylists() {  
        const response = await fetch(location + '/umla.data/playlist.data/playlist.md');
        const json = await response.json();
        let playlistData = await loadExternalPlaylistImages(json);
        playlists.set(playlistData);
  }

  async function loadExternalPlaylistImages(json) {
    const playlists = json;
    let f = 0;
    for (let i = 0; i < playlists.length; i++) {
      f++;
      const playlist = playlists[i];
      const artHandle = await fetch(location + '/umla.data/playlist.data/' + f + '.umla');
      const file = await artHandle.text();
      const contents = file;
      const image = contents;
      playlist.playlistArt = image;
    }
    return playlists;
  }

  async function loadExternalLibrary() {
    const response = await fetch(location + '/umla.data/songMd.json');
    const json = await response.json();
    let songData = await getExternalSongImages(location, json.songMd);
    songs.set(songData);
    await setAlbumSongs();
    await setArtists();
    await loadExternalPlaylists();
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
    background-color: var(--md-sys-color-primary-container);
    padding: 20px;
    border-radius: 20px;
    border: 2px solid var(--md-sys-color-on-primary-container);
  }

  .blur {
    display: flex;
    flex-wrap: wrap;
    margin-left: 1vw;
  }

  .welcome4 .welcome5 h1 {
    font-family: Ubuntu;
    font-size: 50px;
    color: var(--md-sys-color-on-primary-container);
    margin-bottom: 0;
  }

  .welcome4 .welcome5 p {
    font-size: 20px;
    color: var(--md-sys-color-on-primary-container);
    margin-top: 5px;
  }

  .welcome4 .welcome5 button {
    width: 200px;
    height: 50px;
    border-radius: 54px;
    background: var(--md-sys-color-on-primary-fixed);
    margin-top: 25px;
    color: var(--md-sys-color-on-primary-fixed-dim);
    border: none;
    text-align: center;
  }

  .welcome4 button:hover {
    cursor: pointer;
  }

  .small1 {
    font-size: 12px !important;
    color: var(--md-sys-color-primary-fixed-dim) !important;
  }
</style>
