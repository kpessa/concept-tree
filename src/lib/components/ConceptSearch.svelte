<script lang="ts">
  import { conceptList, selectedConcept } from '$lib/stores/conceptStore';
  import type { Concept } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  let searchTerm = '';
  let isFocused = false;
  let filteredConcepts: Concept[] = [];
  const dispatch = createEventDispatcher();

  $: {
    if (searchTerm && isFocused) {
      filteredConcepts = $conceptList.filter(concept =>
        (concept.CONCEPT_ID && concept.CONCEPT_ID.includes(searchTerm.toLowerCase())) ||
        (concept.CONCEPT_NAME && concept.CONCEPT_NAME.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (concept.CONCEPT_NAME_KEY && concept.CONCEPT_NAME_KEY.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 10);
    } else {
      filteredConcepts = [];
    }
  }

  function handleInput() {
    // No need to do anything here, the reactive statement will handle filtering
  }

  function handleFocus() {
    isFocused = true;
  }

  function handleBlur() {
    // Delay hiding the dropdown to allow for concept selection
    setTimeout(() => {
      isFocused = false;
    }, 200);
  }

  function selectConcept(concept: Concept) {
    searchTerm = concept.CONCEPT_NAME;
    selectedConcept.set(concept);
    dispatch('select', concept);
    isFocused = false;
    filteredConcepts = [];
    console.log("Concept selected:", concept.CONCEPT_NAME); // Add this log
  }
</script>

<div class="concept-search">
  <input
    type="text"
    bind:value={searchTerm}
    on:input={handleInput}
    on:blur={handleBlur}
    on:focus={handleFocus}
    placeholder="Search for a concept..."
  />
  {#if isFocused && filteredConcepts.length > 0}
    <ul class="concept-list">
      {#each filteredConcepts as concept}
        <li>
          <button type="button" on:click={() => selectConcept(concept)} class="w-full text-left">
            <strong>{concept.CONCEPT_NAME ?? 'Unnamed Concept'}</strong>
            <br>
            <small>ID: {concept.CONCEPT_ID ?? 'N/A'} | Key: {concept.CONCEPT_KEY ?? 'N/A'}</small>
            <br>
            <small>{concept.CONCEPT_DESC ?? 'No description available'}</small>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .concept-search {
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .concept-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
  }

  li {
    padding: 8px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
  }

  li:last-child {
    border-bottom: none;
  }

  button {
    background: none;
    border: none;
    font: inherit;
    cursor: pointer;
    padding: 0;
    margin: 0;
    text-align: left;
    width: 100%;
    display: block;
  }

  small {
    display: block;
    color: #666;
    font-size: 0.8em;
  }
</style>