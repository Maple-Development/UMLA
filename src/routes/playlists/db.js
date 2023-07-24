import Dexie from "dexie";

export const db = new Dexie("playlist");
db.version(4).stores({
  songMd: "++id, songIds, playlistArt"
});