<script lang="ts">
    import { onMount } from 'svelte';
    import ConceptTree from '$lib/components/ConceptTree.svelte';
    import { conceptData, loadConceptData } from '$lib/stores/conceptStore';
    import ConceptCard from '$lib/components/ConceptCard.svelte';

    let error: string | null = null;

    onMount(async () => {
        console.log("Tree page mounted");
        try {
            await loadConceptData();
        } catch (e) {
            console.error("Error loading concept data:", e);
            error = e instanceof Error ? e.message : 'Unknown error';
        }
    });

    $: {
        console.log("Concept data changed:", $conceptData);
        if ($conceptData === null) {
            error = "Failed to load concept data. Check the browser console for more details.";
        } else {
            error = null;
        }
    }
</script>

<main>
    <h1>Concept Tree Visualization</h1>
    {#if error}
        <p class="error">{error}</p>
    {:else if $conceptData}
        <ConceptTree />
        <div class="mt-8">
            <h2>Root Concept Details</h2>
            <ConceptCard conceptData={$conceptData} />
        </div>
    {:else}
        <p>Loading data... If this message persists, there might be an issue loading the concept data.</p>
    {/if}
</main>

<style>
    .error {
        color: red;
        font-weight: bold;
    }
</style>