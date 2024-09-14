<script>
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { Button } from '$lib/components/ui/button';
  import { ChevronDown, ChevronUp } from 'lucide-svelte';

  let expanded = false;

  const conceptData = {
    CUST_CONCEPT_ID: "2278783",
    CONCEPT_NAME: "Active VAP Care Plan",
    CONCEPT_NAME_KEY: "ACTIVEVAPCAREPLAN",
    CONCEPT_DESC: "Patients with an active care plan for VAP",
    CONCEPT_TYPE_FLAG: "1",
    CONCEPT_RELTN: "",
    EXPIRE_LOOKAHEAD: "",
    EXPIRE_ON_DISCHARGE: "1",
    MULTIPLE_ENTRY_IND: "0",
    UPDT_ID: "25619018",
    UPDT_DT_TM: "12/02/14",
    UPDT_CNT: "0",
    UPDT_APPLCTX: "2063369294"
  };

  const mainFields = ['CONCEPT_NAME', 'CONCEPT_NAME_KEY', 'CONCEPT_DESC'];

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
            <TableCell>{field}</TableCell>
            <TableCell>{conceptData[field]}</TableCell>
          </TableRow>
        {/each}
      </TableBody>
    </Table>
    
    {#if expanded}
      <Table class="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each Object.entries(conceptData) as [key, value]}
            {#if !mainFields.includes(key)}
              <TableRow>
                <TableCell>{key}</TableCell>
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

