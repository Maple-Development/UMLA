<script>
    import { onMount } from 'svelte';
    import { loadScript } from './document.js';
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

  await Promise.all(
    audioFiles.map(async (blob) => {
      const file = blob;
      const tags = await new Promise((resolve, reject) => {
        window.jsmediatags.read(file, {
          onSuccess: resolve,
          onError: reject,
        });
      });

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
}
</script>

<button on:click={addSong}> Upload Songs! </button>