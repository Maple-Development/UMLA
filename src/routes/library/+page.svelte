<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import { songs } from "$lib/store.js"
    import { get, set } from 'idb-keyval';

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
        let songData = await getSongImages(handle, json.songMd);
        songs.set(songData);
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
    {#if $songs && $songs.length > 0}
        {#each $songs as song}
            <LargeSongCard title={song.title} artist={song.artist} albumArt={song.albumArt} type="song" />
        {/each}

        {:else}
            <div class="welcome">
                <h1>No songs found</h1>
                <p>Click the button below to refresh your library</p>
                <p class="small">Tip: You can click the refresh button in the top left at any time!</p>
                <button on:click={showLibrary}>Refresh Library</button>
            </div>
    {/if}
</div>
    
<style>
    .welcome {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 70vh;
        margin-left: auto;
        margin-right: auto;
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

    .small {
        font-size: 12px !important;
        color: #8E8E8E !important;
    }
</style>