<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import { db } from "./db.js";
    import { liveQuery } from 'dexie';

    $: songs = liveQuery(() => db.songMd.limit(25).toArray());

    /*
    let title = "Untitled";
    let artist = "Unknown";
    let albumArt = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png"
    async function addSong() {
        await db.songMd.add({
            title: title,
            artist: artist,
            albumArt: albumArt
        });
    }

    function clearItems() {
        return db.songMd.clear();
    }
    */
</script>

<div class="outer-card">
    {#if $songs}
        {#each $songs as song}
            <LargeSongCard title={song.title} artist={song.artist} albumArt={song.albumArt} />
        {/each}
    {/if}
    <!--
    <input type="text" bind:value={title} />
    <input type="text" bind:value={artist} />
    <input type="text" bind:value={albumArt} />
    <button on:click={addSong}>Add Song</button>
    <button on:click={clearItems}>Clear Items</button>-->
</div>
    