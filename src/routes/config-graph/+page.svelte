<script>
  import TreeGraph from '$lib/components/TreeGraph.svelte';
  import { processedConfigStore } from '$lib/stores/configStore.js';
  import { onMount } from 'svelte';

  let treeData;

  onMount(() => {
    const unsubscribe = processedConfigStore.subscribe(value => {
      treeData = value;
    });

    return unsubscribe;
  });
</script>

<main>
  <h1>Config Graph</h1>
  {#if treeData}
    <TreeGraph {treeData} />
  {:else}
    <p>Loading config data...</p>
  {/if}
</main>

<style>
  main {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
</style>
