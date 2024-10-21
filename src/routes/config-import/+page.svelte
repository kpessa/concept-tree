<script lang="ts">
  import JSONImporter from '$lib/components/JSONImporter.svelte';
  import { onMount } from 'svelte';
  import { loadConfig } from '$lib/stores/configStore';

  onMount(() => {
    loadConfig();
  });
</script>

<svelte:head>
  <title>Config Import</title>
</svelte:head>

<h1 class="text-2xl font-semibold mb-4">Configuration Import</h1>
<JSONImporter />
