<script lang="ts">
  import { onMount } from 'svelte';
  import { conceptData, loadConceptData } from '$lib/stores/conceptStore';
  import type { Concept } from '$lib/types';

  let searchTerm = '';
  let filteredConcepts: Concept[] = [];
  let showDropdown = false;
  let isLoading = true;

  onMount(async () => {
    if ($conceptData === null) {
      console.log('ConceptData is null, loading data...');
      try {
        await loadConceptData();
        isLoading = false;
      } catch (error) {
        console.error('Failed to load concept data:', error);
        isLoading = false;
      }
    } else {
      isLoading = false;
    }
  });

  $: {
    console.log('Current conceptData:', $conceptData);
    if (searchTerm.length >= 2 && $conceptData) {
      filteredConcepts = $conceptData.children.filter((concept: Concept) => 
        concept.CONCEPT_NAME_KEY.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.CONCEPT_DESC.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.CONCEPT_NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
      showDropdown = true;
      console.log('Filtered concepts:', filteredConcepts);
    } else {
      showDropdown = false;
      filteredConcepts = [];
    }
    console.log('Search term:', searchTerm);
    console.log('Show dropdown:', showDropdown);
  }

  function selectConcept(concept: Concept) {
    searchTerm = concept.CONCEPT_NAME;
    showDropdown = false;
    console.log('Selected concept:', concept);
  }
</script>

{#if isLoading}
  <p>Loading concepts...</p>
{:else}
  <div class="concept-search">
    <input
      type="text"
      bind:value={searchTerm}
      placeholder="Search concepts..."
    />
    {#if showDropdown && filteredConcepts.length > 0}
      <ul class="dropdown">
        {#each filteredConcepts as concept (concept.CONCEPT_NAME_KEY)}
          <li on:click={() => selectConcept(concept)}>
            {concept.CONCEPT_NAME}
          </li>
        {/each}
      </ul>
    {:else if showDropdown}
      <p>No matching concepts found</p>
    {/if}
  </div>
{/if}

<style>
  .concept-search {
    position: relative;
  }

  input {
    width: 100%;
    padding: 8px;
  }

  .dropdown {
    position: absolute;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    background-color: white;
  }

  .dropdown li {
    padding: 8px;
    cursor: pointer;
  }

  .dropdown li:hover {
    background-color: #f0f0f0;
  }
</style>