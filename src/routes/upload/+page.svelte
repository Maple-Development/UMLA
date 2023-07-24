<script>
    import { db } from "./db.js";
    import { onMount } from 'svelte';
    import { liveQuery } from 'dexie';
    import { loadScript } from './document.js';
    
    onMount(async () => {
      await loadScript('/libraries/jsmediatags.min.js');
      console.log('script loaded successfully!');
    });

    let files;

    $: if (files) {
        for (const file of files) {
            jsmediatags.read(file, {
                    onSuccess: function(tag) {
                        var tags = tag.tags;
                        console.log(tags);
                    },
                    onError: function(error) {
                        console.log(error);
                    }
                });
            }
    }
</script>

<input type="file" bind:files multiple />