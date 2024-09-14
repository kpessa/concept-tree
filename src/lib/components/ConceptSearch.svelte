<script lang="ts">
  import { onMount } from 'svelte';
  import { conceptList, buildConceptTree, loadConceptData, selectedConcept } from '$lib/stores/conceptStore';
  import type { Concept } from '$lib/types';
  import { goto } from '$app/navigation';

  let searchTerm = '';
  let filteredConcepts: Concept[] = [];
  let showDropdown = false;
  let isLoading = true;

  onMount(async () => {
    if ($conceptList.length === 0) {
      console.log('ConceptList is empty, loading data...');
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
    if (searchTerm.length >= 2 && $conceptList) {
      filteredConcepts = $conceptList.filter((concept: Concept) => 
        concept.CONCEPT_NAME_KEY.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.CONCEPT_DESC.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.CONCEPT_NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
      showDropdown = true;
    } else {
      showDropdown = false;
      filteredConcepts = [];
    }
  }

  function selectConcept(concept: Concept) {
    searchTerm = concept.CONCEPT_NAME;
    showDropdown = false;
    selectedConcept.set(concept);
    buildConceptTree(concept.CONCEPT_NAME_KEY);
    goto('/tree');
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