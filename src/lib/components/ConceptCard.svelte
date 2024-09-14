<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { ChevronDown, ChevronUp } from 'lucide-svelte';

  export let conceptData: Record<string, string>;
  export let mainFields: string[] = ['CONCEPT_DESC'];

  let expanded = false;

  function toggleExpand() {
    expanded = !expanded;
  }
</script>

<div class="border-2 border-gray-300 rounded-lg overflow-hidden max-w-2xl">
  <div class="bg-gray-100 p-4 border-b-2 border-gray-300">
    <h2 class="text-lg font-bold">{conceptData.CONCEPT_NAME || conceptData.name}</h2>
    <p class="text-sm text-gray-600">{conceptData.CONCEPT_NAME_KEY || conceptData.key}</p>
  </div>
  
  <div class="p-4">
    <table class="w-full">
      <tbody>
        {#each mainFields as field}
          {#if field !== 'CONCEPT_NAME' && field !== 'CONCEPT_NAME_KEY' && conceptData[field]}
            <tr class="border-b border-gray-200 last:border-b-0">
              <td class="py-2 pr-4 text-right font-semibold text-sm text-gray-500 align-top w-1/3">{field}</td>
              <td class="py-2 pl-4">{conceptData[field]}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>

  {#if expanded}
    <div class="p-4 bg-gray-50 border-t-2 border-gray-300">
      <table class="w-full">
        <tbody>
          {#each Object.entries(conceptData) as [key, value]}
            {#if !mainFields.includes(key) && key !== 'CONCEPT_NAME' && key !== 'CONCEPT_NAME_KEY' && value}
              <tr class="border-b border-gray-200 last:border-b-0">
                <td class="py-2 pr-4 text-right font-semibold text-sm text-gray-500 align-top w-1/3">{key}</td>
                <td class="py-2 pl-4">{value}</td>
              </tr>
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <div class="p-4 bg-gray-100 border-t-2 border-gray-300">
    <Button on:click={toggleExpand} variant="outline" class="w-full">
      {#if expanded}
        <ChevronUp class="mr-2 h-4 w-4" />
        Hide Details
      {:else}
        <ChevronDown class="mr-2 h-4 w-4" />
        Show Details
      {/if}
    </Button>
  </div>
</div>
