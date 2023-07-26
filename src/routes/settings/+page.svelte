<script>
    import { libLocation } from "$lib/store.js";
    import { Label, Input, Helper, Button } from 'flowbite-svelte';

    let value;
    const submit = () => {
        const linkRegex = /\/$/;
        const modifiedValue = value.replace(linkRegex, ''); // Removes trailing /

        libLocation.set(modifiedValue);
        window.location.reload();
    };

    const reset = () => {
        libLocation.set('local');
        window.location.reload();
    };
</script>

<h1 class="title"> Settings </h1>

<form id="set-location" on:submit={submit} on:reset={reset}>
<Label class="space-y-2 flex justify-center flex-col items-center pb-3">
    <span class="text-white text-xl">Add a Song Location</span>
    <Input bind:value class="w-3/4" type="text" placeholder="Ex: https://raw.githubusercontent.com/John-Doe/Music" size="md" />
</Label>
<Button type="submit">Submit</Button>
<Button type="reset">Reset</Button>
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