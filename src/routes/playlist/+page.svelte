<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import { playlists } from "$lib/store.js";
    import { songs } from "$lib/store.js";
    import { browser } from "$app/environment";
    let playlistName;
    if (browser) {
        playlistName = window.location.pathname.split("/")[2];
    }
    let playlistSongs = [];
     
        $playlists.forEach(playlist => {
            if (playlist.name == playlistName) {
                playlistSongs = playlist.songs;
            }
        });
    $: songs = $songs.filter(song => playlistSongs.includes(song.id));
</script>


{#if playlistName}
<div class="outer-card">
    {#each songs as song}
        <LargeSongCard title={song.title} artist={song.artist} albumArt={song.albumArt} fileName={song.fileName} />
    {/each}
</div>
    {:else}
        <h1>Playlist not found</h1>
{/if}
    
<style>
   
</style>