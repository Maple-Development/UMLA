<script>
  export let title;
  export let artist;
  export let albumArt;
</script>

<div class="card_horiz">
  <div class="img_container">
    <img class="album_art_mini" src={albumArt} alt="album art" />
    <svg
      class="play_hover"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      ><path
        d="M378.5-303 658-480 378.5-658v355ZM480.202-60q-87.109 0-163.755-32.847t-133.713-90.012q-57.067-57.166-89.9-133.539Q60-392.771 60-479.798q0-88.109 32.847-164.755t89.855-133.515q57.009-56.87 133.455-89.901Q392.604-901 479.714-901q88.193 0 164.963 33.085t133.559 89.803q56.789 56.717 89.777 133.268Q901-568.294 901-480.064q0 87.246-33.044 163.876-33.044 76.63-90.013 133.575-56.968 56.946-133.341 89.78Q568.229-60 480.202-60Z"
      /></svg
    >
  </div>
  <div class="text-container">
    <h1 class="song_title_mini">{title}</h1>
    <h2 class="song_artist_mini">{artist}</h2>
  </div>
</div>

<style>
  .card_horiz {
    display: flex;
    flex-direction: row;
    padding: 5px;
  }

  .card_horiz:hover {
    background-color: rgba(44, 44, 44, 0.5);
  }

  .album_art_mini {
    height: 50px;
    width: 50px;
    margin-top: 1vh;
    margin-left: 3vh;
  }

  .song_title_mini {
    font-family: Ubuntu;
    font-size: 2vh;
    text-align: left;
    margin-top: 1vh;
    margin-bottom: 0;
    text-overflow: ellipsis;
    width: 200px;
  }

  .song_artist_mini {
    font-family: Ubuntu;
    margin-bottom: 0;
    text-align: left;
    color: #4f5bc6;
    font-size: 1.5vh;
    text-overflow: ellipsis;
    width: 200px;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    margin-left: 1vh;
  }
</style>
