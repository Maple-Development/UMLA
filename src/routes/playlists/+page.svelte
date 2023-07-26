<script>
    import LargeSongCard from "../../components/large-song-card.svelte";
    import MiniSongCard from "../../components/mini-song-card.svelte";
    import { playlists } from "$lib/store.js";
    import { songs } from "$lib/store.js";
    import { Label, Input, Helper, Button, Checkbox } from 'flowbite-svelte';
    let createTitle;
    let createArt;
    let createSongs = [];

    let playlistStage1 = false;
    let playlistStage2 = false;

    function startPlaylistWizard() {
        playlistStage1 = true;
    }
    

    const submit = () => {
        playlistStage2 = true;
    };

    const reset = () => {
        playlistStage1 = false;
        playlistStage2 = false;
        console.log($songs);
    };

    function createPlaylist() {
        console.log(createSongs)
        const playlist = {
            title: createTitle,
            playlistArt: createArt,
            songs: createSongs
        }
        playlists.update((p) => [...p, playlist]);
        console.log($playlists)
        reset();
    }
</script>

{#if playlistStage1 == false}
<h1 class="title"> Playlists </h1>

<div class="outer-card">
    <div class="card_vert">
        <div class="img_container">
            <div class="album_art fill_grey"></div>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg on:click={startPlaylistWizard} class="play_hover" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
</div>


{#if $playlists.length > 0}
<div class="outer-card">
    {#each $playlists as playlist}
        <LargeSongCard fileName="" title={playlist.title} artist="" albumArt={playlist.playlistArt} type="playlist" />
    {/each}
</div>
{/if}

{:else if playlistStage1 == true && playlistStage2 == false}
<div class="welcome">
    <div class="welcome2">
        <form on:submit={submit} on:reset={reset}>
            <Label class="space-y-2 flex justify-center flex-col items-center pb-3">
                <span class="text-white text-xl">Title</span>
                <Input bind:createTitle class="w-3/4" type="text" placeholder="Rollin'" size="md" />
                <span class="text-white text-xl">Album Art</span>
                <Input bind:createArt class="w-3/4" type="text" placeholder="https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg" size="md" />
                <p class="small">Note: this must be a link to an image</p>
            </Label>
            <Button type="submit">Submit</Button>
            <Button type="reset">Cancel</Button>
        </form>
    </div>
  </div>
{:else if playlistStage1 == true && playlistStage2 == true}
<div class="welcome">
    <div class="welcome3">
        <div class="outer-card2">
            {#each $songs as song}
                <div class="checkbox-align">
                    <!-- add to createSongs array if checked -->
                    <!-- if it is add it if not remove it -->
                    <Checkbox value={song} on:change={() => {
                        if (createSongs.includes(song)) {
                            createSongs = createSongs.filter((item) => item !== song);
                        } else {
                            createSongs = [...createSongs, song];
                        }
                    }} />
                    <MiniSongCard title={song.title} artist={song.artist} albumArt={song.albumArt} />
                </div>
            {/each}
        </div>
        <form on:submit={createPlaylist} on:reset={reset}>
            <Button type="submit">Submit</Button>
            <Button type="reset">Cancel</Button>
        </form>
    </div>
  </div>
{/if}

<style>

    .checkbox-align {
        display: flex;
        align-items: center;
    }

        .outer-card2 {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            justify-content: center;
            align-items: center;
        }

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

      .welcome {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 4;
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

    .welcome3 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #000;
        padding: 20px;
        height: 70vh;
        position: relative;
        border-radius: 20px;
        border: 2px solid #81F0FF;
    }

    .small {
        font-size: 12px !important;
        color: #8E8E8E !important;
    }

</style>