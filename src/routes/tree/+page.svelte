<script lang="ts">
    import { onMount } from 'svelte';
    import { conceptList, conceptTree, selectedConcept, loadConceptData } from '$lib/stores/conceptStore';
    import ConceptTree from '$lib/components/ConceptTree.svelte';
    import ConceptSearch from '$lib/components/ConceptSearch.svelte';
    import { goto } from '$app/navigation';

    let error: string | null = null;
    let isLoading = true;
    let currentConcept: Concept | null = null;

    onMount(async () => {
        try {
            if ($conceptList.length === 0) {
                await loadConceptData();
            }
            console.log('Concepts loaded:', $conceptList.length);
            isLoading = false;
        } catch (e) {
            error = 'Failed to load concepts. Please try again later.';
            isLoading = false;
        }
    });

    function handleConceptSelect(event: CustomEvent) {
        const selectedConceptData = event.detail;
        console.log('Selected concept:', selectedConceptData.CONCEPT_NAME);
        selectedConcept.set(selectedConceptData);
        currentConcept = selectedConceptData;
    }

    $: if ($selectedConcept) {
        currentConcept = $selectedConcept;
    }
</script>

<main>
    <h1>Concept Tree Visualization</h1>
    
    {#if isLoading}
        <p>Loading concepts...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <div class="search-container">
            <ConceptSearch on:select={handleConceptSelect} />
        </div>
        
        {#if currentConcept}
            <ConceptTree rootConcept={currentConcept} />
        {:else}
            <p>No concept selected. Please select a concept from the search.</p>
        {/if}
    {/if}
</main>

<style>
    .error {
        color: red;
    }
    .search-container {
        margin-bottom: 20px;
    }
</style>