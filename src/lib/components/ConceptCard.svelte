<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardFooter, CardHeader } from '$lib/components/ui/card';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { ChevronDown, ChevronUp, ChevronRight, ChevronLeft } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  import { cn } from '$lib/utils';

  export let conceptData: Record<string, string | number>;
  export let mainFields: string[] = ['CONCEPT_DESC'];
  export let toggleChildren: () => void = () => {};
  export let areChildrenExpanded: boolean = true;
  export let width: number = 400;

  let expanded = false;

  const dispatch = createEventDispatcher();

  function toggleExpand() {
    expanded = !expanded;
    dispatch('resize');
  }

  function handleToggleChildren() {
    toggleChildren();
    areChildrenExpanded = !areChildrenExpanded;
    dispatch('resize');
  }

  function highlightSyntax(text: string) {
    return text
     .replace(/([<>]=?|==|!=|<=|>=|=)/g,'<span class="highlight-operator">$1</span>')
      .replace(/\{([^}]+)\}/g, (match, p1) => `{<span class="highlight-bracket">${p1}</span>}`)
      .replace(/\b(AND|OR)\b/g, '<span class="highlight-keyword">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="highlight-number">$1</span>')
      
  }

  $: isComplex = conceptData.CONCEPT_TYPE_FLAG === "2";
  $: conceptType = isComplex ? "Complex" : "Atomic";
  $: highlightedReltn = conceptData.CONCEPT_RELTN ? highlightSyntax(conceptData.CONCEPT_RELTN.toString()) : '';
</script>

<div class="concept-card-wrapper">
  <Card class={cn(
    "concept-card", 
    isComplex ? "complex-concept" : "atomic-concept"
  )} style="width: {width}px;">
    <div class="card-content">
      <Badge class="concept-type-badge" variant={isComplex ? "default" : "secondary"}>
        {conceptType}
      </Badge>
      <CardHeader>
        <h2 class="text-lg font-semibold break-words">{conceptData.CONCEPT_NAME || conceptData.name}</h2>
        <p class="text-sm text-muted-foreground break-words">{conceptData.CONCEPT_NAME_KEY || conceptData.key}</p>
      </CardHeader>
      
      <CardContent>
        <div class="space-y-4">
          {#each mainFields as field}
            {#if (field === 'CONCEPT_DESC' || field === 'CONCEPT_RELTN') && conceptData[field]}
              <div class="space-y-2">
                <Label for={field} class="text-xs font-medium">{field}</Label>
                {#if field === 'CONCEPT_RELTN' && isComplex}
                  <div class="concept-reltn-wrapper syntax-highlight">
                    {@html highlightedReltn}
                  </div>
                {:else}
                  <p id={field} class="text-sm break-words">{conceptData[field]}</p>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      </CardContent>

      {#if expanded}
        <CardContent>
          <div class="space-y-4">
            {#each Object.entries(conceptData) as [key, value]}
              {#if !mainFields.includes(key) && key !== 'CONCEPT_NAME' && key !== 'CONCEPT_NAME_KEY' && key !== 'CONCEPT_TYPE_FLAG' && value}
                <div class="space-y-2">
                  <Label for={key} class="text-xs font-medium">{key}</Label>
                  <p id={key} class="text-sm break-words">{value}</p>
                </div>
              {/if}
            {/each}
          </div>
        </CardContent>
      {/if}

      <CardFooter class="flex justify-between pt-4">
        <Button on:click={toggleExpand} variant="outline" class="w-full">
          {#if expanded}
            <ChevronUp class="mr-2 h-4 w-4" />
            Hide Details
          {:else}
            <ChevronDown class="mr-2 h-4 w-4" />
            Show Details
          {/if}
        </Button>

        {#if isComplex}
          <Button on:click={handleToggleChildren} variant="outline" class="ml-2">
            {#if areChildrenExpanded}
              <ChevronLeft class="mr-2 h-4 w-4" />
              Collapse Children
            {:else}
              <ChevronRight class="mr-2 h-4 w-4" />
              Expand Children
            {/if}
          </Button>
        {/if}
      </CardFooter>
    </div>
  </Card>
</div>

<style>
  .card-content {
    position: relative;
  }

  :global(.concept-type-badge) {
    position: absolute;
    top: 0.2rem;
    right: 0.2rem;
    z-index: 10;
  }

  :global(.concept-card){
    position: relative;
    transition: height 0.3s ease-in-out;
    max-width: 100%;
    background-color: hsl(var(--background));
  }

  :global(.break-words) {
    word-break: break-word;
    overflow-wrap: break-word;
  }

  :global(.complex-concept) {
    border-width: 3px;
    border-color: hsl(var(--border));
  }

  :global(.atomic-concept) {
    border-width: 2px;
    /* border-color: hsl(var(--muted)); */
  }

  :global(.syntax-highlight .highlight-bracket) {
    color: black;
    font-weight: bold;
  }

  :global(.syntax-highlight .highlight-keyword) {
    color: #2196f3; /* Blue */
    font-weight: bold;
  }

  :global(.syntax-highlight .highlight-number) {
    color: brown; 
    font-weight: bold;
  }

  :global(.syntax-highlight .highlight-operator) {
    color: #4caf50; /* Green */
    font-weight: bold;
  }

  .concept-reltn-wrapper {
    font-family: monospace;
    font-size: 0.9em;
    line-height: 1.4;
    background-color: #f5f5f5;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 4px;
    padding: 8px;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  :global(.concept-reltn-wrapper pre) {
    white-space: pre-wrap;
    word-break: break-word;
  }
</style>
