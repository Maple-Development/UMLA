<script>
    import Dexie from "dexie";
    import { db } from "../library/db.js";
    import { onMount } from 'svelte';
    import { liveQuery } from 'dexie';
    import { loadScript } from './document.js';
    
    onMount(async () => {
      await loadScript('/libraries/jsmediatags.min.js');
      console.log('script loaded successfully!');
    });

    let files;

    $: if (files) {
        addSong();
    }

    async function addSong() {
        for (const file of files) {
            jsmediatags.read(file, {
                    onSuccess: function(tag) {
                        var tags = tag.tags;
                        let picture = tags.picture;
                        let imageStr = undefined;
                        if (picture) {
                            let base64String = "";
                            for (let i = 0; i < picture.data.length; i++) {
                                base64String += String.fromCharCode(picture.data[i]);
                            }
                        let base64 = "data:" + picture.format + ";base64," +
                            window.btoa(base64String);
                            imageStr = base64;
                        } else {
                            imageStr = "/assets/album_art_placeholder.png";
                        }
                        db.songMd.add({
                            title: tags.title,
                            artist: tags.artist,
                            albumArt: imageStr,
                            album: tags.album
                        });
                        db.songData.add({
                            songData: file
                        })
                    },
                    onError: function(error) {
                        console.log(error);
                    }
                });
            }
    }
</script>

<input type="file" bind:files multiple />