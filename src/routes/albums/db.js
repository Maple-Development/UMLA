import Dexie from "dexie";

export const db = new Dexie("album");
db.version(4).stores({
  album: "++id, songIds, albumArt"
});