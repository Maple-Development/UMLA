import Dexie from "dexie";

export const db = new Dexie("songData");
db.version(4).stores({
  songData: "++id, songData"
});