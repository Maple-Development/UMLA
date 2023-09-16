import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const songs = writable([]);
export const albums = writable([]);
export const artists = writable([]);
export const audio = writable(null);
export const handle = writable(null);
export const index = writable([]);
export const currentlyPlaying = writable(null);
let libraryLocation = 'local';
let playlists1 = [];
let shuffle = false;

if (browser) {
  // if the object already exists in localStorage, get it
  // otherwise, use our default values
  libraryLocation = localStorage.getItem('libraryLocation')
    ? JSON.parse(localStorage.getItem('libraryLocation'))
    : 'local';
  playlists1 = localStorage.getItem('playlists')
    ? JSON.parse(localStorage.getItem('playlists'))
    : [];
  shuffle = localStorage.getItem('shuffle')
    ? JSON.parse(localStorage.getItem('shuffle'))
    : false;
}

export const libLocation = writable(libraryLocation);
export const playlists = writable(playlists1);
export const shufflePlaylist = writable(shuffle);

if (browser) {
  // update localStorage values whenever the store values change
  libLocation.subscribe((value) =>
    // localStorage only allows strings, so convert non-strings to strings
    localStorage.setItem('libraryLocation', JSON.stringify(value)),
  );

  playlists.subscribe((value) =>
    // localStorage only allows strings, so convert non-strings to strings
    localStorage.setItem('playlists', JSON.stringify(value)),
  );

  shufflePlaylist.subscribe((value) =>
    // localStorage only allows strings, so convert non-strings to strings
    localStorage.setItem('shuffle', JSON.stringify(value)),
  );
}

if (browser) {
  audio.subscribe((value) => {
    if (value) {
      var audioElement = document.getElementsByTagName('audio')[0];
      audioElement.src = value;
      audioElement.play().catch((err) => {
        console.log(err);
      });
    }
  });
}
