<script>
    let searchQuery;
</script>

<input class="searchBar" type="text" bind:value={searchQuery} placeholder="What are you trying to find?" />

{#if searchQuery}
    <h1 class="title"> Songs </h1>
    <!--
    <div class="outer-card">
        {#each $songs as song}
            {#if song.title.toLowerCase().includes(searchQuery.toLowerCase())}
                <LargeSongCard title={song.title} artist={song.artist} albumArt={song.albumArt} />
            {/if}
        {/each}
    -->
    <h1 class="title"> Artists </h1>
    <!--
    <div class="outer-card">
        {#each $artists as artist}
            {#if artist.name.toLowerCase().includes(searchQuery.toLowerCase())}
                <LargeSongCard title={artist.name} artist={artist.name} albumArt={artist.albumArt} />
            {/if}
        {/each}
    -->
    <h1 class="title"> Albums </h1>
    <!--
    <div class="outer-card">
        {#each $albums as album}
            {#if album.title.toLowerCase().includes(searchQuery.toLowerCase())}
                <LargeSongCard title={album.title} artist={album.artist} albumArt={album.albumArt} />
            {/if}
        {/each}
    -->
{/if}



<style>
    @import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@500&display=swap");
    .searchBar {
        width: 600px;
        height: 50px;
        border-radius: 54px;
        background: #1A1B23;
        margin-top: 50px;
        color: white;
        border: none;
        text-align: center;
    }

    .title {
        font-family: Ubuntu;
        color: white;
        margin-top: 25px;
        margin-left: 50px;
        text-align: left;
        font-size: 45px;
    }
</style>