<script>
  import LargeSongCard from '../../components/large-song-card.svelte';
  import MiniSongCard from '../../components/mini-song-card.svelte';
  import { playlists } from '$lib/store.js';
  import { songs, libLocation } from '$lib/store.js';
  import { Label, Input, Helper, Button, Checkbox } from 'flowbite-svelte';
  import { get, set } from 'idb-keyval';
  let createTitle;
  let createArt;
  let createSongs = [];

  let playlistStage1 = false;
  let playlistStage2 = false;

  function startPlaylistWizard() {
    playlistStage1 = true;
  }

  const submit = () => {
    playlistStage2 = true;
  };

  const reset = () => {
    playlistStage1 = false;
    playlistStage2 = false;
  };

async function createPlaylist() {
  const ids = createSongs.map((song) => song.id);

// Filter out undefined albumArt values and limit to 4 songs
const songsWithArt = $songs
  .filter((s) => ids.includes(s.id) && s.albumArt)
  .slice(0, 4);

// Create an array of albumArt values
const albumArtArray = songsWithArt.map((song) => song.albumArt);

if (createArt == '' || createArt == undefined) {
  // Use the albumArtArray to generate and save the collage
  if (albumArtArray.length > 3) {
    createArt = await generateAndSaveCollage(...albumArtArray);
  } else {
    const song = $songs.find((s) => s.id == createSongs[0].id);
    createArt = song.albumArt;
  }
}

const playlist = {
  title: createTitle,
  sources: [
    {
      location: 'local',
      songs: [],
    },
    {
      location: $libLocation,
      songs: [],
    },
  ],
};
const sourcesByLocation = {};

for (let i = 0; i < createSongs.length; i++) {
  const location = createSongs[i].location;
  const songId = createSongs[i].id;

  if (!sourcesByLocation[location]) {
    sourcesByLocation[location] = {
      location: location,
      songs: [],
    };
  }

  sourcesByLocation[location].songs.push(songId);
}

const sources = Object.values(sourcesByLocation);
playlist.sources = sources;

console.log(playlist);


  let d;
  const fileHandleOrUndefined = await get('file');
    if (fileHandleOrUndefined) {
      d = fileHandleOrUndefined;
    } else {
      d = await window.showDirectoryPicker();
      await set('file', d);
    }
  const f = await d.getDirectoryHandle('umla.data');
  const pdir = await f.getDirectoryHandle('playlist.data');
  const p = await pdir.getFileHandle('playlist.md');
  const pd = await f.getDirectoryHandle('playlist.data');
  let allPlaylists = await pushPlaylists(pdir, playlist);
  let artNum = allPlaylists.length;
  createPlaylistArt(pd, artNum, createArt);
  const pfile = await p.createWritable();
  await pfile.write(JSON.stringify(allPlaylists));
  await pfile.close();
  reset();
}

async function pushPlaylists(handle, playlist) {
  const playlistFilePath = 'playlist.md';

// Read the current playlist file
const file = await handle.getFileHandle(playlistFilePath);
const contents = await file.getFile();
const currentPlaylistsData = await contents.text();
let currentPlaylists;
if (currentPlaylistsData) {
  currentPlaylists = JSON.parse(currentPlaylistsData);
} else {
  currentPlaylists = [];
}

// Add the new playlist to the current playlists
currentPlaylists.push(playlist);
return currentPlaylists; 
}

async function createPlaylistArt(handle, num, photo) {
    let title = num + '.umla';
    const cm = await handle.getFileHandle(title, { create: true });
    const cmf = await cm.createWritable();
    await cmf.write(photo);
    await cmf.close();
}


function loadImage(url) {
    // Create a new Promise
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
    });
}


  async function generateAndSaveCollage(image1, image2, image3, image4) {
    
    let imageUrls = [image1, image2, image3, image4];
    imageUrls = imageUrls.filter((imageUrl) => imageUrl);


    const imageElements = await Promise.all(imageUrls.map(loadImage));

    // Create a canvas to draw the collage
    const canvas = document.createElement('canvas');
    canvas.width = 400; // Set the desired width
    canvas.height = 400; // Set the desired height
    const ctx = canvas.getContext('2d');

    // Draw the images on the canvas
    for (let i = 0; i < imageElements.length && i < 4; i++) {
        const x = (i % 2) * 200; // Arrange images in a 2x2 grid
        const y = Math.floor(i / 2) * 200;
        ctx.drawImage(imageElements[i], x, y, 200, 200);
    }

    // Convert the canvas to a data URL and create a download link
    const collageDataURL = canvas.toDataURL('image/png');
    return collageDataURL;
}
</script>

{#if playlistStage1 == false}
  <div class="favorites">
    <h1 class="favorites_header">Playlists</h1>
  <div class="outer-card">
    <div class="card_vert">
      <div class="img_container">
        <div class="album_art fill_grey"></div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <svg
          on:click={startPlaylistWizard}
          class="play_hover"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Capa_1" clip-path="url(#clip0_261_223)">
            <g id="SVGRepo_iconCarrier">
              <path
                class="path1"
                id="Vector"
                d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z"
                fill=""
              />
              <path
                class="path2"
                id="Vector_2"
                d="M50 26V76"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                class="path2"
                id="Vector_3"
                d="M75 50H25"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_261_223">
              <rect width="100" height="100" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <h1 class="song_title">Create New Playlist</h1>
    </div>

    {#if $playlists.length > 0}
      {#each $playlists as playlist}
        <LargeSongCard
          fileName=""
          title={playlist.title}
          artist=""
          albumArt={playlist.playlistArt}
          type="playlist"
        />
      {/each}
    {/if}
  </div>
  </div>
{:else if playlistStage1 == true && playlistStage2 == false}
  <div class="welcome">
    <div class="welcome2">
      <form on:submit={submit} on:reset={reset}>
        <Label class="space-y-2 flex justify-center flex-col items-center pb-3">
          <span class="text-white text-xl">Title</span>
          <Input
            bind:value={createTitle}
            class="w-3/4"
            type="text"
            placeholder="Rollin'"
            size="md"
          />
          <span class="text-white text-xl">Album Art</span>
          <Input
            bind:value={createArt}
            class="w-3/4"
            type="text"
            placeholder="https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg"
            size="md"
          />
          <p class="small">Note: this must be a link to an image</p>
        </Label>
        <Button type="submit">Submit</Button>
        <Button type="reset">Cancel</Button>
      </form>
    </div>
  </div>
{:else if playlistStage1 == true && playlistStage2 == true}
  <div class="welcome">
    <div class="welcome3">
      <div class="outer-card2">
        {#each $songs as song}
          <div class="checkbox-align">
            <!-- add to createSongs array if checked -->
            <!-- if it is add it if not remove it -->
            <Checkbox
              value={song}
              on:change={() => {
                if (createSongs.includes(song)) {
                  createSongs = createSongs.filter((item) => item !== song);
                } else {
                  createSongs = [...createSongs, song];
                }
              }}
            />
            <MiniSongCard
              title={song.title}
              artist={song.artist}
              albumArt={song.albumArt}
            />
          </div>
        {/each}
      </div>
      <form on:submit={createPlaylist} on:reset={reset}>
        <Button type="submit">Submit</Button>
        <Button type="reset">Cancel</Button>
      </form>
    </div>
  </div>
{/if}

<style>
  .path1 {
    fill: var(--md-sys-color-on-secondary-container);
  }

  .path2 {
    stroke: var(--md-sys-color-on-secondary-fixed-variant);
  }

  .checkbox-align {
    display: flex;
    align-items: center;
  }

  .outer-card2 {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    justify-content: center;
    align-items: center;
  }
  
  .fill_grey {
    background-color: var(--md-sys-color-on-secondary-fixed);
    height: 200px;
    width: 200px;
    margin-left: 3vh;
    margin-right: 3vh;
    margin-top: 3vh;
  }

  .welcome {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
  }

  .welcome2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000;
    padding: 20px;
    border-radius: 20px;
    border: 2px solid #81f0ff;
  }

  .welcome3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #000;
    padding: 20px;
    height: 70vh;
    position: relative;
    border-radius: 20px;
    border: 2px solid #81f0ff;
  }

  .small {
    font-size: 12px !important;
    color: #8e8e8e !important;
  }
</style>
