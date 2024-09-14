<script lang="ts">
  import ConceptCard from './ConceptCard.svelte';

  export let conceptData: Record<string, string | number>;
  export let mainFields: string[] = ['CONCEPT_DESC', 'CONCEPT_RELTN'];
  export let toggleChildren: () => void;
</script>

<ConceptCard 
  {conceptData} 
  {mainFields} 
  {toggleChildren} 
  on:resize
/>