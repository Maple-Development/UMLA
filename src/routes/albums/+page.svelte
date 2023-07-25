<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import { db } from "../library/db.js";
    import { liveQuery } from 'dexie';

    $: albums = liveQuery(() => db.album.toArray());
</script>

<h1 class="title"> Albums </h1>

<div class="outer-card">
    {#if $albums}
        {#each $albums as album}
            <LargeSongCard title={album.title} artist={album.artist} albumArt={album.albumArt} type="album" />
        {/each}
    {/if}
</div>

<style>
    .title {
        font-family: Ubuntu;
        color: white;
        margin-top: 25px;
        margin-left: 50px;
        text-align: left;
        font-size: 45px;
        margin-bottom: 0;
    }
</style>