<script>
    import { onMount } from 'svelte';
    import { loadScript } from './document.js';
    import FakeCard from '../../components/fake-card.svelte';
    import { libLocation } from '$lib/store.js';

    $: location = $libLocation;
    import {
        fileOpen,
        directoryOpen,
        fileSave,
        supported,
    } from 'browser-fs-access';
    import { get, set } from 'idb-keyval';
    onMount(async () => {
      await loadScript('/libraries/jsmediatags.min.js');
      console.log('script loaded successfully!');
    });

    let uploadShow = false;
    let working = true;
    let working2 = false;
  let progressBarLength = 0;
  let current = 0;
  let progressBar2Length = 0;
  let current2 = 0;
    async function addSong() {
  const blobsInDirectory = await directoryOpen({
    recursive: true,
  });

  const audioFiles = blobsInDirectory.filter((blob) => {
    const fileName = blob.name.toLowerCase();
    return (
      fileName.endsWith(".mp3") ||
      fileName.endsWith(".wav") ||
      fileName.endsWith(".flac") ||
      fileName.endsWith(".ogg") ||
      fileName.endsWith(".m4a")
    );
  });

  const updatedJson = { "songMd": [] };
  const fileHandleOrUndefined = await get('file');
  let d;
  if (fileHandleOrUndefined) {
    d = fileHandleOrUndefined;
  }
  else {
    d = await window.showDirectoryPicker();
    await set('file', d);
  }
  progressBarLength = audioFiles.length;
  progressBar2Length = audioFiles.length;
  working2 = true;
  await Promise.all(
    audioFiles.map(async (blob) => {
      const file = blob;
      const tags = await new Promise((resolve, reject) => {
        window.jsmediatags.read(file, {
          onSuccess: resolve,
          onError: reject,
        });
      });
      current++;
      let picture = tags.tags.picture;
      let str = undefined;

      if (picture) {
        let base64String = "";
        for (let i = 0; i < picture.data.length; i++) {
          base64String += String.fromCharCode(picture.data[i]);
        }
        let base64 = "data:" + picture.format + ";base64," + window.btoa(base64String);

        str = base64;
      } else {
        str = "/assets/album_art_placeholder.png";
      }
      await createDataFolder(d);
      saveSongPhoto(str, tags.tags.title, updatedJson.songMd.length + 1, d);
      const songMd = {
        id: updatedJson.songMd.length + 1,
        title: tags.tags.title || "Unknown",
        artist: tags.tags.artist || "Unknown",
        album: tags.tags.album || "Unknown",
        track: tags.tags.track || "0",
        fileName: file.name,
      };

      updatedJson.songMd.push(songMd);
    })
  );
  
  saveSongMd(updatedJson, d);

}

async function createDataFolder(handle) {
  const d = handle;
  const dataFolder = await d.getDirectoryHandle("umla.data", { create: true });
  return dataFolder;
}

async function saveSongPhoto(photo, title, count, handle) {
  current2++;
  title = count;
  const d = await handle.getDirectoryHandle("umla.data");
  let fileTitle = title + ".umla";
  const cm = await d.getFileHandle(fileTitle, { create: true });
  const cmf = await cm.createWritable();
  await cmf.write(photo);
  await cmf.close();
}

  async function saveSongMd(updatedJson, handle) {
    const jsonData = JSON.stringify(updatedJson, null, 2);
    const fileBlob = new Blob([jsonData], { type: 'application/json' });
    const saveFileName = "songMd.json";
    const d = await handle.getDirectoryHandle("umla.data");
    const fileHandle = await d.getFileHandle(saveFileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(fileBlob);
    await writable.close();
    working2 = false;
    working = false;
}
</script>

{#if location == "local" || location == undefined}
{#if uploadShow == true}

<div class="welcome">
  <div class="welcome2">
    {#if working == true}
    <button on:click={addSong}> Upload Songs! </button>
    <div class="flex">
      <div>
        <h1> {current} / {progressBarLength} </h1>
        <p> Processing files... </p>
        <progress value={current} max={progressBarLength}></progress>
      </div>
      <br>
      <div>
        <h1> {current2} / {progressBar2Length} </h1>
        <p> Saving files... </p>
        <progress value={current2} max={progressBar2Length}></progress>
      </div>
    </div>
    {#if working2 == false && working == true}
    <h1>Waiting on Upload...</h1>
    <p> Press the Upload Songs button, and select your music folder. </p>
    <button on:click={window.location.href = '/settings'}> Use External </button>
    <p> Press the Use External button to set an external location to load songs from </p>
    {:else if working2 == true && working == true}
    <h1>Please Wait...</h1>
    <p> This may take a while depending on the size of your library. </p>
    {/if}
    {:else if working == false}
    <h1>Upload Complete!</h1>
    <p> Checkout your library! </p>
    <button on:click={() => window.location.href = '/library'}> Go to Library </button>
    {/if}
  </div>
</div>

  {:else}
  <div class="welcome">
    <div class="welcome2">
      <h1> Welcome to UMLA! </h1>
      <p> To get started, click the button below to upload your music library! </p>
      <button on:click={() => uploadShow = true}> Upload Songs! </button>
    </div>
  </div>
{/if}
{:else}
<div class="welcome">
  <div class="welcome2">
    <h1> Welcome to UMLA! </h1>
    <p> Your using an external location, so no need to upload anything! </p>
    <button on:click={() => window.location.href = '/library'}> Go to Library </button>
  </div>
</div>
{/if}
<div class="blur">
  <FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard />
</div>


<style>
    .welcome {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 4;
    }

    .blur {
        display: flex;
        flex-wrap: wrap;
        margin-left: 1vw;
    }

    .welcome2 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #000;
        padding: 20px;
        border-radius: 20px;
        border: 2px solid #81F0FF;
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

    .welcome button:focus {
        outline: none;
    }

    .flex div {
        margin-left: 25px;
        margin-right: 25px;
    }
</style>