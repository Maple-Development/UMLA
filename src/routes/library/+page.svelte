<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import FakeCard from "../../components/fake-card.svelte";
    import { songs } from "$lib/store.js";
    import { get, set } from 'idb-keyval';
    import { handle } from "$lib/store.js";
    import { libLocation } from "$lib/store.js";

    $: location = $libLocation;

    async function loadExternalLibrary() {
        const response = await fetch(location + "/umla.data/songMd.json");
        const json = await response.json();
        let songData = await getExternalSongImages(location, json.songMd);
        songs.set(songData);
    }

    async function getExternalSongImages(location, json) {
        const songs = json;
        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const response = await fetch(location + "/umla.data/" + song.id + ".umla");
            const albumArt = await response.text();
            song.albumArt = albumArt;
        }
        return songs;
    }
    async function showLibrary() {
        if (location !== "local" && location !== undefined) {
            loadExternalLibrary();
            return;
        }
        let handles;
        const fileHandleOrUndefined = await get('file');
        if (fileHandleOrUndefined) {
            handles = fileHandleOrUndefined;
        }
        else {
            handles = await window.showDirectoryPicker();
            await set('file', d);
        }
        handle.set(handles);
        await verifyPermission(handles);
        const d = await handles.getDirectoryHandle("umla.data");
        const metadata = await d.getFileHandle("songMd.json");
        const file = await metadata.getFile();
        const contents = await file.text();
        const json = JSON.parse(contents);
        let songData = await getSongImages(handles, json.songMd);
        songs.set(songData);
        console.log(location);
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
            <LargeSongCard fileName={song.fileName} title={song.title} artist={song.artist} albumArt={song.albumArt} type="song" />
        {/each}

        {:else}
            <div class="welcome">
                <div class="welcome2">
                    <h1>Welcome!</h1>
                    <p>Click the button below to refresh your library</p>
                    <p class="small">Tip: You can click the refresh button in the top right at any time!</p>
                    <button on:click={showLibrary}>Refresh Library</button>
                </div>
            </div>
            <div class="blur">
                <FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard /><FakeCard />
            </div>
        {/if}
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

    .small {
        font-size: 12px !important;
        color: #8E8E8E !important;
    }
</style>