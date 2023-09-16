<script>
    import { Label, Input, Helper, Button } from 'flowbite-svelte';
    import { browser } from '$app/environment';

    if (!browser) {

    }
  
    const start = () => {
      
    };
  
    const stop = () => {
      
    };
  </script>
  
  <h1 class="title">Stream Library</h1>
  
  <form id="set-location" on:submit={start} on:reset={stop}>
    <Button type="submit">Start Streaming</Button>
    <Button type="reset">Stop Streaming</Button>
  </form>
  
  <style>
    .title {
      font-family: Ubuntu;
      color: white;
      margin-top: 25px;
      margin-left: 50px;
      text-align: left;
      font-size: 45px;
      margin-bottom: 0;
    }
  </style>
  