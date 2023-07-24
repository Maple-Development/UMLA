import Dexie from "dexie";

export const db = new Dexie("songMetadata");
db.version(4).stores({
  songMd: "++id, title, artist, albumArt"
});

db.on("populate", () => {
  db.songMd.bulkAdd([
    {
      title: "Just What I Need",
      artist: "The Cars",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png"
    },
    {
      title: "Just What I Need",
      artist: "The Cars2",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png"
    }
  ]);
});
