<script>
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
let e;
let duration;
let paused;
let time;
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