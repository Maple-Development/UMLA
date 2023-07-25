import Dexie from "dexie";

export const db = new Dexie("songStore");
db.version(1).stores({
  songMd: "++id, title, artist, albumArt, album",
  playlist: "++id, songIDs, playlistArt, title",
  album: "++id, songIds, albumArt, title, artist",
  songData: "++id, songData"
});

db.on("populate", () => {
  db.playlist.bulkAdd([
      {
          songIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          playlistArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png",
          title: "The Cars"
      },
      {
          songIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          playlistArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png",
          title: "The Cars"
      }
  ]);

  db.album.bulkAdd([
    {
      songIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      albumArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png",
      title: "The Cars",
      artist: "The Cars"
    },
    {
      songIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      albumArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png",
      title: "The Cars",
      artist: "The Cars"
    },
    {
      songIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      albumArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png",
      title: "The Cars",
      artist: "The Cars"
    },
    {
      songIds: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      albumArt: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/The_Cars_-_The_Cars.png/220px-The_Cars_-_The_Cars.png",
      title: "The Cars",
      artist: "The Cars"
    }
  ]);
});
