<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { ToggleGroup, ToggleGroupItem } from "$lib/components/ui/toggle-group";
  import { toast } from "svelte-sonner";
  import { configStore, updateConfig } from '$lib/stores/configStore';
  import Monaco from 'svelte-monaco';
  import * as monaco from 'monaco-editor';

  let file: File | null = null;
  let inputMode: 'file' | 'text' = 'file';
  let editor: monaco.editor.IStandaloneCodeEditor | null = null;
  let editorContent = '';

  $: editorContent = JSON.stringify($configStore, null, 2);

  onMount(() => {
    if (editor) {
      editor.setValue(editorContent);
    }
  });

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      file = input.files[0];
      processJSON(file);
    }
  }

  async function processJSON(input: File | string) {
    try {
      let jsonData;
      if (input instanceof File) {
        const text = await input.text();
        jsonData = JSON.parse(text);
      } else {
        jsonData = JSON.parse(input);
      }
      updateConfig(jsonData);
      if (editor) {
        editor.setValue(JSON.stringify(jsonData, null, 2));
      }
      toast.success("JSON Processed", {
        description: "Configuration updated successfully.",
      });
    } catch (error: unknown) {
      toast.error("Error Processing JSON", {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }

  function handleInputModeChange(value: string) {
    inputMode = value as 'file' | 'text';
  }

  function triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.click();
  }

  function handleEditorInit(e: CustomEvent<{ editor: monaco.editor.IStandaloneCodeEditor }>) {
    editor = e.detail.editor;
    editor.setValue(editorContent);
  }

  function formatJSON() {
    if (editor) {
      editor.getAction('editor.action.formatDocument')?.run();
    }
  }

  function processEditorContent() {
    if (editor) {
      const content = editor.getValue();
      processJSON(content);
    }
  }
</script>

<div class="space-y-4">
  <ToggleGroup onValueChange={handleInputModeChange} type="single" value={inputMode}>
    <ToggleGroupItem value="file">File Input</ToggleGroupItem>
    <ToggleGroupItem value="text">Text Input</ToggleGroupItem>
  </ToggleGroup>

  {#if inputMode === 'file'}
    <Input type="file" accept=".json" on:change={handleFileSelect} />
    {#if file}
      <p class="text-sm text-muted-foreground">Selected file: {file.name}</p>
    {/if}
    <Button on:click={triggerFileInput}>
      Choose JSON File
    </Button>
  {/if}

  <div class="mt-4">
    <h3 class="text-lg font-semibold mb-2">JSON Editor:</h3>
    <div class="h-[400px] border rounded-md overflow-hidden">
      <Monaco
        value={editorContent}
        theme="vs-dark"
        on:init={handleEditorInit}
        options={{
          language: 'json',
          minimap: { enabled: false },
          folding: true,
          foldingStrategy: 'indentation',
          automaticLayout: true,
          readOnly: false
        }}
      />
    </div>
    <div class="mt-2 space-x-2">
      <Button on:click={formatJSON}>Format JSON</Button>
      <Button on:click={processEditorContent}>Process JSON</Button>
    </div>
  </div>
</div>
