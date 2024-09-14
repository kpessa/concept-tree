<script>
  import AtomicConcept from '$lib/components/AtomicConcept.svelte';
  import ComplexConcept from '$lib/components/ComplexConcept.svelte';
  import ConceptBuilder from '$lib/components/ConceptBuilder.svelte';
</script>

<main>
  <h1>Concept Examples</h1>
  <h2>Atomic Concept</h2>
  <AtomicConcept conceptData={{ /* your data here */ }} mainFields={['CONCEPT_DESC']} />
  <h2 class="mt-8">Complex Concept</h2>
  <ComplexConcept conceptData={{ /* your data here */ }} mainFields={['CONCEPT_DESC', 'CONCEPT_RELTN']} />
  <!-- <ConceptBuilder /> -->
</main>
