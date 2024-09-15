<script lang="ts">
  import ConceptCard from './ConceptCard.svelte';

  export let conceptData: Record<string, string | number>;
  export let mainFields: string[] = ['CONCEPT_DESC'];
  export let width: number = 400; // Add default value
</script>

<ConceptCard {conceptData} {mainFields} {width} />

