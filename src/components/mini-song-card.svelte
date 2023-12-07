<script>
  import '../routes/css/components/mini-song-card.css';

  export let title;
  export let artist;
  export let albumArt;
</script>

<div class="mini-card">
  <div class="img_container">
    <img class="album_art" src={albumArt} alt="album art" />
  </div>
  <div class="text-container">
    <h1 class="song_title">{title}</h1>
    <h2 class="song_artist">{artist}</h2>
  </div>
</div>