<script lang="ts">
  import JSONImporter from '$lib/components/JSONImporter.svelte';
  import { onMount } from 'svelte';
  import { loadConfig } from '$lib/stores/configStore';

  onMount(() => {
    loadConfig();
  });
</script>

<h1 class="text-2xl font-bold mb-4">Configuration Import</h1>
<JSONImporter />
