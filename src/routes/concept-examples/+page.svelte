<script lang="ts">
  import ConceptCard from '$lib/components/ConceptCard.svelte';
  import { atomicConcept, complexConcept } from '$lib/exampleConcepts';

  const atomicMainFields = ['CONCEPT_DESC', 'ATOMIC_NUMBER', 'ATOMIC_MASS'];
  const complexMainFields = ['CONCEPT_DESC', 'CONCEPT_RELTN', 'BOND_TYPES'];
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Concept Examples</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <h2 class="text-xl font-semibold mb-2">Atomic Concept</h2>
      <ConceptCard 
        conceptData={atomicConcept}
        mainFields={atomicMainFields}
        width={400}
        toggleChildren={() => {}}
      />
    </div>
    
    <div>
      <h2 class="text-xl font-semibold mb-2">Complex Concept</h2>
      <ConceptCard 
        conceptData={complexConcept}
        mainFields={complexMainFields}
        width={400}
        toggleChildren={() => {}}
        areChildrenExpanded={true}
      />
    </div>
  </div>
</div>
