<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";
  import { toast } from "svelte-sonner";
  import Papa from 'papaparse';
  import { conceptList, updateConcepts } from '$lib/stores/conceptStore';

  let file: File | null = null;
  let csvText = '';
  let concepts: any[] = [];
  let inputMode: 'file' | 'text' = 'file';
  let processingResult = {
    previousTotal: 0,
    added: 0,
    updated: 0,
    unchanged: 0,
    atomic: 0,
    complex: 0
  };

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      file = input.files[0];
      processCSV(file);
    }
  }

  function processCSV(input: File | string) {
    const parseConfig = {
      complete: (results) => {
        concepts = results.data;
        processConceptsAndUpdateStore(concepts);
      },
      header: true,
    };

    if (typeof input === 'string') {
      Papa.parse(input, parseConfig);
    } else {
      Papa.parse(input, parseConfig);
    }
  }

  function processConceptsAndUpdateStore(newConcepts) {
    conceptList.update(currentConcepts => {
      processingResult = {
        previousTotal: currentConcepts.length,
        added: 0,
        updated: 0,
        unchanged: 0,
        atomic: 0,
        complex: 0
      };

      const updatedConcepts = [...currentConcepts];

      newConcepts.forEach(newConcept => {
        const index = updatedConcepts.findIndex(c => c.CONCEPT_NAME_KEY === newConcept.CONCEPT_NAME_KEY);
        if (index !== -1) {
          if (JSON.stringify(updatedConcepts[index]) !== JSON.stringify(newConcept)) {
            updatedConcepts[index] = { ...updatedConcepts[index], ...newConcept };
            processingResult.updated++;
          } else {
            processingResult.unchanged++;
          }
        } else {
          updatedConcepts.push(newConcept);
          processingResult.added++;
        }

        if (newConcept.CONCEPT_TYPE_FLAG == 1) {
          processingResult.atomic++;
        } else if (newConcept.CONCEPT_TYPE_FLAG == 2) {
          processingResult.complex++;
        }
      });

      showProcessingResult();
      return updatedConcepts;
    });
  }

  function showProcessingResult() {
    const { previousTotal, added, updated, unchanged, atomic, complex } = processingResult;
    const total = added + updated + unchanged;
    const newTotal = previousTotal + added;
    
    toast.success("CSV Processed", {
      description: `
        Previous total: ${previousTotal}
        New total: ${newTotal}
        Added: ${added}
        Updated: ${updated}
      `,
      duration: 5000,
    });
  }

  function handleTextInput() {
    if (csvText.trim()) {
      processCSV(csvText);
    }
  }
  
  function handleInputModeChange(value: string) {
    inputMode = value as 'file' | 'text';
  }

  function triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }
</script>

<div class="space-y-4">
  <ToggleGroup onValueChange={handleInputModeChange} type="single" value={inputMode}>
    <ToggleGroupItem value="file">File Input</ToggleGroupItem>
    <ToggleGroupItem value="text">Text Input</ToggleGroupItem>
  </ToggleGroup>

  {#if inputMode === 'file'}
    <Input type="file" accept=".csv" on:change={handleFileSelect} />
    {#if file}
      <p class="text-sm text-muted-foreground">Selected file: {file.name}</p>
    {/if}
    <Button on:click={triggerFileInput}>
      Choose CSV File
    </Button>
  {:else}
    <Textarea bind:value={csvText} placeholder="Paste your CSV data here..." rows="10" />
    <Button on:click={handleTextInput}>Process CSV Text</Button>
  {/if}

  {#if concepts.length > 0}
    <div class="mt-4 space-y-4">
      <h3 class="text-lg font-semibold">Processed Concepts Summary:</h3>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-100 p-4 rounded-md">
          <h4 class="font-semibold mb-2">Concept Counts</h4>
          <p>Previous total: {processingResult.previousTotal}</p>
          <p>New total: {processingResult.previousTotal + processingResult.added}</p>
          <p>Processed in this import: {concepts.length}</p>
        </div>
        
        <div class="bg-gray-100 p-4 rounded-md">
          <h4 class="font-semibold mb-2">Import Results</h4>
          <p>Added: {processingResult.added}</p>
          <p>Updated: {processingResult.updated}</p>
          <p>Unchanged: {processingResult.unchanged}</p>
        </div>
        
        <div class="bg-gray-100 p-4 rounded-md">
          <h4 class="font-semibold mb-2">Concept Types</h4>
          <p>Atomic concepts: {processingResult.atomic}</p>
          <p>Complex concepts: {processingResult.complex}</p>
        </div>
      </div>
    </div>
  {/if}
</div>