<script>
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';
    import Monaco from 'svelte-monaco';
    import { Button } from "$lib/components/ui/button";
    
    export let node = null;
    export let isOpen = false;

    let detailContainer;
    let isResizing = false;
    let startX;
    let startWidth;
    let editor;

    function getNodeProperties(node) {
        if (!node || !node.data) return [];
        return Object.entries(node.data)
            .filter(([key, value]) => key !== 'children' && typeof value !== 'object')
            .map(([key, value]) => ({ key, value: value?.toString() || '' }));
    }

    function prettyPrintJSON(obj) {
        const replacer = (key, value) => {
            if (key === 'children') {
                return '[...]';
            }
            if (key === 'SUB' && Array.isArray(value)) {
                return value.map(item => {
                    const { SUB, ...rest } = item;
                    return { ...rest, SUB: SUB ? '[...]' : undefined };
                });
            }
            return value;
        };
        return JSON.stringify(obj, replacer, 2);
    }

    function startResize(event) {
        isResizing = true;
        startX = event.clientX;
        startWidth = parseInt(document.defaultView.getComputedStyle(detailContainer).width, 10);
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
    }

    function resize(event) {
        if (isResizing) {
            const width = startWidth - (event.clientX - startX);
            detailContainer.style.width = `${width}px`;
        }
    }

    function stopResize() {
        isResizing = false;
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    }

    function handleEditorInit(e) {
        editor = e.detail.editor;
    }

    onMount(() => {
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResize);
        };
    });

    $: nodeJSON = node ? prettyPrintJSON(node.data) : '';
    $: nodeProperties = node ? getNodeProperties(node) : [];
</script>

{#if isOpen && node}
    <div 
        class="node-detail"
        bind:this={detailContainer}
        transition:fly={{ x: 300, duration: 300 }}
    >
        <div class="resize-handle" on:mousedown={startResize}></div>
        <div class="content">
            <h2>{node.data.OBJECTKEY || node.data.DISPLAY || 'Node Details'}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Field</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {#each nodeProperties as { key, value }}
                        <tr>
                            <td class="field-name">{key}</td>
                            <td>{value}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <Button variant="secondary" on:click={() => isOpen = false}>Close</Button>
            <h3>Node JSON:</h3>
            <div class="monaco-container">
                <Monaco
                    value={nodeJSON}
                    theme="vs-dark"
                    on:init={handleEditorInit}
                    options={{
                        language: 'json',
                        minimap: { enabled: false },
                        folding: true,
                        foldingStrategy: 'indentation',
                        automaticLayout: true,
                        readOnly: true,
                        wordWrap: 'on',
                        wordWrapColumn: 80,
                        wrappingIndent: 'indent'
                    }}
                />
            </div>
        </div>
    </div>
{/if}

<style>
    .node-detail {
        position: fixed;
        top: 0;
        right: 0;
        width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        resize: horizontal;
        min-width: 300px;
        max-width: 80vw;
        z-index: 1000;
    }

    .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 20px;
    }

    .resize-handle {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 5px;
        cursor: ew-resize;
        background-color: #f0f0f0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
        vertical-align: top;
    }

    th {
        background-color: #f2f2f2;
        font-weight: bold;
    }

    .field-name {
        font-weight: bold;
        font-size: 0.9em;
        text-align: right;
    }

    button {
        display: block;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .monaco-container {
        flex-grow: 1;
        border: 1px solid #ddd;
        margin-top: 10px;
        min-height: 200px;
    }
</style>
