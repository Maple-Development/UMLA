<script>
import { browser } from '$app/environment';
let e;
let duration;
let paused;
let time;

	if (browser) {
		window.addEventListener('message', (event) => {
			if (event.origin !== window.location.origin) {
				return;
			}

			const data = event.data;
			if (data !== 'pause') {
			return;
			}
			if (paused === true) {
				paused = false;
			} else {
				paused = true;
			}
    	}); 
	}
</script>

	<audio
        src=""
		bind:currentTime={e}
		bind:duration
		bind:paused
		preload="metadata"
		on:ended={() => {
			let messageData = 'ended';
      		window.postMessage(messageData, window.location.href);
		}}
	/>