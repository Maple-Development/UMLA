<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import { db } from "./db.js";
    import { liveQuery } from 'dexie';

    $: playlist = liveQuery(() => db.playlist.toArray());
</script>

<h1 class="title"> Playlists </h1>
<div class="outer-card">
    <div class="card_vert">
        <div class="img_container">
            <div class="album_art fill_grey"></div>
            <svg class="play_hover" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Capa_1" clip-path="url(#clip0_261_223)">
                <g id="SVGRepo_iconCarrier">
                <path id="Vector" d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z" fill="#232323"/>
                <path id="Vector_2" d="M50 26V76" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                <path id="Vector_3" d="M75 50H25" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                </g>
                <defs>
                <clipPath id="clip0_261_223">
                <rect width="100" height="100" fill="white"/>
                </clipPath>
                </defs>
                </svg>
        </div>
      <h1 class="song_title">Create New Playlist</h1>
    </div>
    <LargeSongCard title="real" artist="fake" albumArt="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png" />
    <LargeSongCard title="real" artist="fake" albumArt="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png" />
    <LargeSongCard title="real" artist="fake" albumArt="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png" />
    <LargeSongCard title="real" artist="fake" albumArt="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png" />



    <!--
{#if $playlists}
    {#each $playlists as playlist}
        <LargeSongCard title={playlist.title} artist={playlist.artist} albumArt={playlist.albumArt} />
    {/each}
{/if}
-->
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

    .fill_grey {
        background-color: #1A1B23;
        height: 200px;
        width: 200px;
        margin-left: 3vh;
        margin-right: 3vh;
        margin-top: 3vh;
    }
</style>