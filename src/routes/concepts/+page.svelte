<script lang="ts">
  import { onMount } from 'svelte';
  import { conceptList, loadConceptData } from '$lib/stores/conceptStore';
  import ConceptTable from '$lib/components/ConceptTable.svelte';
  import { goto } from '$app/navigation';
  import type { Concept } from '$lib/types';

  let isLoading = true;

  onMount(async () => {
    if ($conceptList.length === 0) {
      await loadConceptData();
    }
    isLoading = false;
  });

  function handleConceptSelect(event: CustomEvent<Concept>) {
    goto('/tree');
  }
</script>

<h1>Concept Table</h1>

{#if isLoading}
  <p>Loading concepts...</p>
{:else}
  <ConceptTable concepts={$conceptList} on:select={handleConceptSelect} />
{/if}