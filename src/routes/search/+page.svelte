<script lang="ts">
  import { onMount } from 'svelte';
  import ConceptSearch from '$lib/components/ConceptSearch.svelte';
  import { loadConceptData } from '$lib/stores/conceptStore';

  onMount(async () => {
    await loadConceptData();
  });
</script>

<h1>Concept Search</h1>
<ConceptSearch />