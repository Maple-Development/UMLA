<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import { get, set } from 'idb-keyval';
    let songs = [];
    async function showLibrary() {
        let handle;
        const fileHandleOrUndefined = await get('file');
        if (fileHandleOrUndefined) {
            handle = fileHandleOrUndefined;
        }
        else {
            handle = await window.showDirectoryPicker();
            await set('file', d);
        }
        await verifyPermission(handle);
        const d = await handle.getDirectoryHandle("umla.data");
        const metadata = await d.getFileHandle("songMd.json");
        const file = await metadata.getFile();
        const contents = await file.text();
        const json = JSON.parse(contents);
        songs = await getSongImages(handle, json.songMd);
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

    async function getSongImages(handle, json) {
        const songs = json;
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const d = await handle.getDirectoryHandle("umla.data");
            const songHandle = await d.getFileHandle(song.id + ".umla");
            const songFile = await songHandle.getFile();
            const songContents = await songFile.text();
            song.albumArt = songContents;
        }
        return songs;
    }

</script>

<div class="outer-card">
    {#if songs}
        {#each songs as song}
            <LargeSongCard title={song.title} artist={song.artist} albumArt={song.albumArt} type="song" />
        {/each}
    {/if}
    <div class="no-songs">
        <h1>No songs found</h1>
        <p>Click the button below to add songs to your library</p>
        <button on:click={showLibrary}>Add songs</button>
    </div>
</div>
    