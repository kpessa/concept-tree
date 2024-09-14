<script lang="ts">
    import { onMount } from 'svelte';
    import { conceptTree, selectedConcept } from '$lib/stores/conceptStore';
    import ConceptTree from '$lib/components/ConceptTree.svelte';
    import SearchConcept from '$lib/components/ConceptSearch.svelte';
    import { goto } from '$app/navigation';

    let error: string | null = null;

    $: {
        if (!$selectedConcept) {
            error = 'No concept selected. Please select a concept from the search or concept table.';
        } else {
            error = null;
        }
    }

    function goBack() {
        goto('/concepts');
    }
</script>

<main>
    <h1>Concept Tree Visualization</h1>
    <SearchConcept />
    
    {#if error}
        <p class="error">{error}</p>
        <button on:click={goBack}>Go Back</button>
    {:else if $selectedConcept}
        <ConceptTree rootConcept={$selectedConcept} />
    {/if}
</main>

<style>
    .error {
        color: red;
    }
</style>