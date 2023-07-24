import Dexie from "dexie";

export const db = new Dexie("playlist");
db.version(4).stores({
  playlist: "++id, songIds, playlistArt"
});