<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";
  import { toast } from "svelte-sonner";
  import Papa from 'papaparse';
  import { conceptList } from '$lib/stores/conceptStore';

  let file: File | null = null;
  let csvText = '';
  let concepts: any[] = [];
  let inputMode: 'file' | 'text' = 'file';

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
        conceptList.set(concepts); // Update the store
        toast.success("CSV Processed", {
          description: `${concepts.length} concepts were processed.`,
        });
      },
      header: true,
    };

    if (typeof input === 'string') {
      Papa.parse(input, parseConfig);
    } else {
      Papa.parse(input, parseConfig);
    }
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
    <div class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Processed Concepts Summary:</h3>
      <p>Total concepts processed: {concepts.length}</p>
      <p>Atomic concepts: {concepts.filter(c => c.CONCEPT_TYPE_FLAG == 1).length}</p>
      <p>Complex concepts: {concepts.filter(c => c.CONCEPT_TYPE_FLAG == 2).length}</p>
    </div>
  {/if}
</div>