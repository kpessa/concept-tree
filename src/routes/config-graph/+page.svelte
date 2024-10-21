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

<svelte:head>
  <title>Config Graph</title>
</svelte:head>

<h1 class="text-2xl font-semibold mb-4">Config Graph</h1>
{#if treeData}
  <div class="h-[calc(100vh-120px)]">
    <TreeGraph {treeData} />
  </div>
{:else}
  <p>Loading config data...</p>
{/if}

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
