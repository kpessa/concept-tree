<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Button } from '$lib/components/ui/button';
  import { ChevronDown, ChevronUp } from 'lucide-svelte';

  export let conceptData: Record<string, string>;
  export let mainFields: string[];

  let expanded = false;

  function toggleExpand() {
    expanded = !expanded;
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>{conceptData.CONCEPT_NAME}</CardTitle>
  </CardHeader>
  <CardContent>
    <Table>
      <TableBody>
        {#each mainFields as field}
          <TableRow>
            <TableCell class="text-right font-bold text-sm text-gray-500">{field}</TableCell>
            <TableCell>{conceptData[field]}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
    
    {#if expanded}
      <Table class="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead class="text-right">Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each Object.entries(conceptData) as [key, value]}
            {#if !mainFields.includes(key)}
              <TableRow>
                <TableCell class="text-right font-bold text-sm text-gray-500">{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            {/if}
          {/each}
        </TableBody>
      </Table>
    {/if}
    
    <Button on:click={toggleExpand} variant="outline" class="mt-4">
      {#if expanded}
        <ChevronUp class="mr-2 h-4 w-4" />
        Hide Details
      {:else}
        <ChevronDown class="mr-2 h-4 w-4" />
        Show Details
      {/if}
    </Button>
  </CardContent>
</Card>
