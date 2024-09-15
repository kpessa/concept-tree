<script lang="ts">
  import ConceptCard from './ConceptCard.svelte';

  export let conceptData: Record<string, string | number>;
  export let mainFields: string[] = ['CONCEPT_DESC', 'CONCEPT_RELTN'];
  export let toggleChildren: () => void;
  export let width: number = 400; // Add default value
  let areChildrenExpanded = true;
</script>

<ConceptCard {conceptData} {mainFields} {toggleChildren} bind:areChildrenExpanded {width} />