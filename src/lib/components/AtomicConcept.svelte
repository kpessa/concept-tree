<script lang="ts">
  import ConceptCard from './ConceptCard.svelte';

  export let conceptData: Record<string, string>;
  export let mainFields: string[] = ['CONCEPT_DESC'];
</script>

<ConceptCard {conceptData} {mainFields} />

