<script>
  import { libLocation } from '$lib/store.js';
  import { Label, Input, Helper, Button } from 'flowbite-svelte';

  let value;
  let css;
  var libArray = [];
  $: location = libArray.push($libLocation);
  const submit = () => {
    const linkRegex = /\/$/;
    const modifiedValue = value.replace(linkRegex, ''); // Removes trailing /

    // Add new location to $libLocation array
    if (location) {
      libArray.push(modifiedValue);
      libLocation.set(libArray);
    } else {
      libLocation.set(modifiedValue);
    }
    window.location.reload();
  };

  const reset = () => {
    libLocation.set('local');
    window.location.reload();
  };

  

const submitTheme = () => {
  const reader = new FileReader();
  reader.onload = event => {
    const cssText = event.target.result;
    const regex = /--md-sys-color-([\w-]+-dark):\s*(.*?);/g;
    let match;
    let newStyles = ":root {\n";
    while ((match = regex.exec(cssText)) !== null) {
      const variable = match[1];
      const value = match[2];
      const updatedStyle = `  --md-sys-color-${variable.replace("-dark", "")}: ${value.trim()} !important;\n`;
      newStyles += updatedStyle;
    }
    newStyles += "}";

    const styleId = "theme-override";
    let existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.textContent = newStyles;
    } else {
      existingStyle = document.createElement("style");
      existingStyle.id = styleId;
      existingStyle.textContent = newStyles;
      document.head.appendChild(existingStyle);
    }

    localStorage.setItem("themeStyles", newStyles);
  };
  reader.onerror = error => reject(error);
  reader.readAsText(css);
};

  const resetTheme = () => {

  };
</script>

<h1 class="title">Settings</h1>
<div class="favorites">
  <h1 class="favorites_header">Custom Location</h1>
<form id="set-location" on:submit={submit} on:reset={reset}>
  <Label class="space-y-2 flex flex-col pb-3">
    <span class="text-xl" style="color: var(--md-sys-color-on-surface);">Add a new Song Location</span>
    <Input
      bind:value
      class="w-3/4"
      type="text"
      placeholder="Ex: https://raw.githubusercontent.com/John-Doe/Music"
      size="md"
    />
  </Label>
  <span class="text-xl" style="color: var(--md-sys-color-on-surface);">Current Locations Added:</span>
  <br>
  {#each libArray as location}
  <span class="text-sm" style="color: var(--md-sys-color-primary);">{location}</span>
  {/each}
  <br>
  <Button class="w-24" type="submit">Submit</Button>
  <Button class="w-24" type="reset">Reset</Button>
</form>
</div>

<form on:submit={submitTheme} on:reset={resetTheme}>
<div class="favorites">
  <h1 class="favorites_header">Themes</h1>
    <span class="text-xl" style="color: var(--md-sys-color-on-surface);">Please upload tokens.css from a <a style="color: var(--md-sys-color-primary)" href="https://www.figma.com/community/plugin/1034969338659738588/material-theme-builder">Material You</a> theme archive.</span>
   <input
      type="file"
      id="theme-import"
      on:change={(e) => (css = e.target.files[0])}
      class="mb-2"
      accept="*.css"
    />
    <Label class="space-y-2 inline-block pb-3">
    <Button class="w-24" type="submit">Submit</Button>
    <Button class="w-24" type="reset">Reset</Button>
  </Label>
</div>
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
