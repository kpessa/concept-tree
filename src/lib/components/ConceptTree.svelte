<script>
    import { onMount, tick } from 'svelte';
    import * as d3 from 'd3';
    import { conceptData, loadConceptData } from '$lib/stores/conceptStore';
    import ZoomControl from './ZoomControl.svelte';
    import AtomicConcept from './AtomicConcept.svelte';
    import ComplexConcept from './ComplexConcept.svelte';

    let svg;
    let treeContainer;
    let error = null;
    let zoomLevel = 100;

    onMount(async () => {
        try {
            await loadConceptData();
            if ($conceptData) {
                console.log("Concept data loaded:", $conceptData);
                await tick(); // Wait for DOM update
                renderTree($conceptData);
            } else {
                error = "No data available to render";
            }
        } catch (e) {
            console.error("Error loading or processing data:", e);
            error = `Error: ${e instanceof Error ? e.message : 'Unknown error'}. Check the console for more details.`;
        }
    });

    function renderTree(data) {
        if (!data) {
            error = "No data available to render";
            return;
        }
        
        console.log("Rendering tree with data:", data);
        
        const width = 3000; // Increased width
        const height = 2000; // Increased height
        const margin = { top: 100, right: 120, bottom: 40, left: 120 };

        const treemap = d3.tree().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

        const root = d3.hierarchy(data);
        root.x0 = height / 2;
        root.y0 = 0;

        svg = d3.select(treeContainer)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 14px sans-serif; user-select: none;")
            .style("border", "1px solid black");

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
                zoomLevel = Math.round(event.transform.k * 100);
            });

        svg.call(zoom);

        update(root);

        function update(source) {
            const treeData = treemap(root);
            const nodes = treeData.descendants();
            const links = treeData.links();

            nodes.forEach((d) => {
                d.x = d.x + width / 2; // Center the nodes horizontally
                d.y = d.depth * 200; // Adjust vertical spacing
            });

            const node = g.selectAll('g.node')
                .data(nodes, d => d.data.CUST_CONCEPT_ID);

            const nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", d => `translate(${source.x0},${source.y0})`)
                .on('click', (event, d) => {
                    click(d);
                    update(d);
                });

            nodeEnter.each(function(d) {
                renderConceptComponent(this, d.data);
            });

            const nodeUpdate = nodeEnter.merge(node);

            nodeUpdate.transition()
                .duration(750)
                .attr("transform", d => `translate(${d.x},${d.y})`);

            const nodeExit = node.exit().transition()
                .duration(750)
                .attr("transform", d => `translate(${source.x},${source.y})`)
                .remove();

            const link = g.selectAll('path.link')
                .data(links, d => d.target.data.CUST_CONCEPT_ID);

            const linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', d => {
                    const o = {x: source.x0, y: source.y0};
                    return diagonal(o, o);
                });

            const linkUpdate = linkEnter.merge(link);

            linkUpdate.transition()
                .duration(750)
                .attr('d', d => diagonal(d, d.parent));

            link.exit().transition()
                .duration(750)
                .attr('d', d => {
                    const o = {x: source.x, y: source.y};
                    return diagonal(o, o);
                })
                .remove();

            nodes.forEach(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        function diagonal(s, d) {
            if (!s || !d) {
                console.error('Invalid input to diagonal function:', { s, d });
                return 'M0,0L0,0'; // Return a dummy path
            }
            return `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;
        }

        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
        }
    }

    function renderConceptComponent(element, data) {
        const foreignObject = d3.select(element)
            .append('foreignObject')
            .attr('width', 800) // Initial width
            .attr('height', 600) // Initial height
            .attr('x', -400) // Adjusted x position
            .attr('y', -300); // Adjusted y position

        const div = foreignObject.append('xhtml:div')
            .style('width', '100%')
            .style('height', '100%')
            .style('overflow', 'hidden');

        let component;
        if (data.CONCEPT_TYPE_FLAG === 1) {
            component = new AtomicConcept({
                target: div.node(),
                props: { conceptData: data, mainFields: ['CONCEPT_DESC'] }
            });
        } else {
            component = new ComplexConcept({
                target: div.node(),
                props: { conceptData: data, mainFields: ['CONCEPT_DESC', 'CONCEPT_RELTN'] }
            });
        }

        // Use ResizeObserver to dynamically adjust the size of the foreignObject
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                foreignObject
                    .attr('width', width + 20) // Add padding
                    .attr('height', height + 20) // Add padding
                    .attr('x', -400) // Keep original x position
                    .attr('y', -300); // Keep original y position
            }
        });

        resizeObserver.observe(div.node());

        // Clean up the observer when the component is destroyed
        return () => resizeObserver.disconnect();
    }

    function handleZoom(event) {
        const svgElement = svg.node();
        if (svgElement) {
            const zoom = d3.zoom();
            if (event.detail.direction === 'in') {
                zoom.scaleBy(svg.transition().duration(750), 1.2);
            } else if (event.detail.direction === 'out') {
                zoom.scaleBy(svg.transition().duration(750), 1 / 1.2);
            } else if (event.detail.level) {
                const scale = event.detail.level / 100;
                zoom.scaleTo(svg.transition().duration(750), scale);
            }
        }
    }
</script>

<div>
    <h2>Concept Tree</h2>
    <div class="zoom-control-container">
        <ZoomControl {zoomLevel} on:zoom={handleZoom} />
    </div>
    {#if error}
        <p class="error">{error}</p>
    {:else}
        <div bind:this={treeContainer}></div>
    {/if}
</div>

<style>
    .zoom-control-container {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
    }
    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 2px;
    }
    .error {
        color: red;
        font-weight: bold;
    }
</style>