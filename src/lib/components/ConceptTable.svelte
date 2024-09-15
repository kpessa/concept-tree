<script lang="ts">
  import { onMount } from 'svelte';
  import type { Concept } from '$lib/types';
  import { createEventDispatcher } from 'svelte';
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
  import { conceptList, buildConceptTree } from '$lib/stores/conceptStore';
  import { Button } from "$lib/components/ui/button";

  export let concepts: Concept[] = [];

  let searchTerm = '';
  let sortColumn = 'CONCEPT_NAME';
  let sortDirection: 'asc' | 'desc' = 'asc';
  let columnWidths: { [key: string]: number } = {};
  let tableElement: HTMLElement;

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (concepts.length > 0) {
      const columns = Object.keys(concepts[0]);
      columns.forEach(column => {
        columnWidths[column] = 200; // Default width
      });
      columnWidths = { ...columnWidths };
    }
  });

  let tableWidth = 0;

  $: {
    if (concepts.length > 0) {
      tableWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
    }
  }

  $: filteredConcepts = concepts.filter(concept =>
    Object.values(concept).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  $: sortedConcepts = [...filteredConcepts].sort((a, b) => {
    const aValue = String(a[sortColumn]);
    const bValue = String(b[sortColumn]);
    return sortDirection === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  let currentPage = 1;
  let itemsPerPage = 10;

  $: totalPages = Math.ceil(filteredConcepts.length / itemsPerPage);
  $: paginatedConcepts = sortedConcepts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  function handleSort(column: string) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }

  function selectConcept(concept: Concept) {
    buildConceptTree(concept.CONCEPT_NAME_KEY);
    dispatch('select', concept);
  }

  function startResize(event: MouseEvent, column: string) {
    event.preventDefault();
    const startX = event.pageX;
    const startWidth = columnWidths[column];

    function resize(e: MouseEvent) {
      const diff = e.pageX - startX;
      columnWidths[column] = Math.max(50, startWidth + diff);
      columnWidths = { ...columnWidths };
    }

    function stopResize() {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    }

    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }
</script>

<div class="concept-table">
  <input
    type="text"
    bind:value={searchTerm}
    placeholder="Filter concepts..."
    class="w-full p-2 mb-4 border rounded"
  />

  <div class="table-container" bind:this={tableElement}>
    <Table>
      <TableHeader>
        <TableRow>
          {#each Object.keys(concepts[0] || {}) as column}
            <TableHead style="width: {columnWidths[column]}px; min-width: {columnWidths[column]}px; position: relative;">
              <div class="flex justify-between items-center">
                <span on:click={() => handleSort(column)} class="cursor-pointer">
                  {column} {sortColumn === column ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
                </span>
                <div
                  class="resize-handle"
                  on:mousedown={(e) => startResize(e, column)}
                ></div>
              </div>
            </TableHead>
          {/each}
        </TableRow>
      </TableHeader>
      <TableBody>
        {#each paginatedConcepts as concept (concept.CONCEPT_NAME_KEY)}
          <TableRow on:click={() => selectConcept(concept)} class="cursor-pointer">
            {#each Object.entries(concept) as [key, value]}
              <TableCell style="width: {columnWidths[key]}px; min-width: {columnWidths[key]}px;">{value}</TableCell>
            {/each}
          </TableRow>
        {/each}
      </TableBody>
    </Table>
  </div>

  <div class="pagination">
    <Button on:click={prevPage} disabled={currentPage === 1}>Previous</Button>
    <span>{currentPage} of {totalPages}</span>
    <Button on:click={nextPage} disabled={currentPage === totalPages}>Next</Button>
  </div>
</div>

<style>
  .concept-table {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .table-container {
    flex-grow: 1;
    width: 100%;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
  }

  /* For Webkit browsers like Chrome and Safari */
  .table-container::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  .table-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .table-container::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 6px;
    border: 3px solid #f1f1f1;
  }

  .table-container::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  /* For Firefox */
  .table-container {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }

  :global(.table-container table) {
    border-collapse: separate;
    border-spacing: 0;
    width: max-content;
    min-width: 100%;
  }

  :global(.table-container th),
  :global(.table-container td) {
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.table-container th:last-child),
  :global(.table-container td:last-child) {
    border-right: none;
  }

  :global(.table-container tr:last-child td) {
    border-bottom: none;
  }

  .resize-handle {
    width: 5px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    cursor: col-resize;
    user-select: none;
    z-index: 1;
  }

  .resize-handle:hover {
    background-color: rgba(0, 102, 204, 0.3);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
</style>