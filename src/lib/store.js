import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const songs = writable([]);
export const albums = writable([]); 
export const audio = writable(null);
export const handle = writable(null);
export const currentlyPlaying = writable(null);

if (browser) {
    audio.subscribe((value) => {
        if (value) {
            var audioElement = document.getElementById("audio");
            audioElement.src = value;
            audioElement.play().catch((err) => {
                console.log(err);
            });
        }
    });
}