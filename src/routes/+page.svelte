<script>
  import ConceptCard from '$lib/components/ConceptCard.svelte';

  function handleConceptSubmit(event) {
    const conceptData = event.detail;
    console.log(conceptData);
  }
</script>

<ConceptCard on:submit={handleConceptSubmit} />
