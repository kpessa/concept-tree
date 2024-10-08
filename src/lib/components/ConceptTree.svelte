<script lang="ts">
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { conceptTree, buildConceptTree, selectedConcept } from '$lib/stores/conceptStore';
  import type { Concept } from '$lib/types';
  import ZoomControl from './ZoomControl.svelte';
  import AtomicConcept from './AtomicConcept.svelte';
  import ComplexConcept from './ComplexConcept.svelte';

  export let rootConcept: Concept;

  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  let g: d3.Selection<SVGGElement, unknown, null, undefined>;
  let treeContainer: HTMLElement;
  let error: string | null = null;
  let zoomLevel = 100;
  let root: d3.HierarchyNode<Concept>;
  let isLoading = false;
  let loadingStatus = '';
  let treeData: Concept | null = null;
  let zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;

  const FIXED_NODE_WIDTH = 400; // Set a fixed width for all nodes
  const MIN_NODE_HEIGHT = 300;
  const MIN_HORIZONTAL_SPACING = 100;
  const MIN_VERTICAL_SPACING = 100;

  let updateTree: (source: d3.HierarchyNode<Concept>) => void;

  let zoomTransform: d3.ZoomTransform;

  let previousRootId: string | null = null;

  $: if (rootConcept && rootConcept.CONCEPT_NAME_KEY !== previousRootId) {
    console.log("Root concept changed:", rootConcept.CONCEPT_NAME);
    previousRootId = rootConcept.CONCEPT_NAME_KEY;
    isLoading = true;
    loadingStatus = 'Building concept tree...';
    buildConceptTree(rootConcept.CONCEPT_NAME_KEY);
  }

  $: if ($conceptTree && $conceptTree.CONCEPT_NAME_KEY === rootConcept.CONCEPT_NAME_KEY) {
    console.log("Rendering tree for:", rootConcept.CONCEPT_NAME);
    treeData = $conceptTree;
    renderTree(treeData);
  }

  function renderTree(data: Concept) {
    if (!data) {
      error = 'No data available to render';
      isLoading = false;
      return;
    }

    // Clear previous tree if any
    if (treeContainer) {
      d3.select(treeContainer).selectAll('*').remove();
    }

    const width = 3000;
    const height = 2000;
    const margin = { top: 100, right: 120, bottom: 40, left: 120 };

    const treemap = d3.tree<Concept>().nodeSize([FIXED_NODE_WIDTH + MIN_HORIZONTAL_SPACING, MIN_NODE_HEIGHT + MIN_VERTICAL_SPACING]);

    root = d3.hierarchy(data);
    root.x0 = width / 2;
    root.y0 = 0;

    svg = d3
      .select(treeContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; font: 14px sans-serif; user-select: none;')
      .style('border', '1px solid black');

    g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    initializeZoom();

    updateTree = (source: d3.HierarchyNode<Concept>) => {
      const treeData = treemap(root);
      const nodes = treeData.descendants();
      const links = treeData.links();

      nodes.forEach((d) => {
        d.y = d.depth * (MIN_NODE_HEIGHT + MIN_VERTICAL_SPACING);
      });

      const node = g.selectAll<SVGGElement, d3.HierarchyNode<Concept>>('g.node')
        .data(nodes, (d) => d.data.CONCEPT_NAME_KEY);

      const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d) => `translate(${source.x0},${source.y0})`);

      nodeEnter.each(function (d) {
        renderConceptComponent(this, d);
      });

      const nodeUpdate = nodeEnter.merge(node);

      nodeUpdate.transition()
        .duration(750)
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

      node.exit().remove();

      const link = g.selectAll<SVGPathElement, d3.HierarchyLink<Concept>>('path.link')
        .data(links, (d) => d.target.data.CONCEPT_NAME_KEY);

      const linkEnter = link.enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', d3.linkVertical<d3.HierarchyLink<Concept>, d3.HierarchyNode<Concept>>()
          .x((d) => d.x)
          .y((d) => d.y));

      link.merge(linkEnter).transition()
        .duration(750)
        .attr('d', d3.linkVertical<d3.HierarchyLink<Concept>, d3.HierarchyNode<Concept>>()
          .x((d) => d.x)
          .y((d) => d.y));

      link.exit().remove();

      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    updateTree(root);

    // After initial render, update node sizes based on actual content
    setTimeout(() => {
      loadingStatus = 'Adjusting node sizes...';
      updateNodeSizes();
      updateTree(root);
      isLoading = false;
      loadingStatus = '';
    }, 1000);
  }

  function updateNodeSizes() {
    svg.selectAll('g.node').each(function(this: SVGGElement, d: d3.HierarchyNode<Concept>) {
      const foreignObject = d3.select(this).select('foreignObject');
      const div = foreignObject.select('div');
      const contentHeight = div.node()?.scrollHeight || MIN_NODE_HEIGHT;

      d.height = Math.max(contentHeight + 40, MIN_NODE_HEIGHT); // Add padding
      d.width = FIXED_NODE_WIDTH; // Use fixed width

      foreignObject
        .attr('width', d.width)
        .attr('height', d.height)
        .attr('x', -d.width / 2)
        .attr('y', -d.height / 2);

      div.style('width', `${d.width}px`)
         .style('height', `${d.height}px`);
    });

    const treemap = d3.tree<Concept>().nodeSize([
      FIXED_NODE_WIDTH + MIN_HORIZONTAL_SPACING,
      d3.max(root.descendants(), (d: any) => d.height) + MIN_VERTICAL_SPACING
    ]);

    treemap(root);
  }

  function toggleChildren(d: d3.HierarchyNode<Concept>) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    updateTree(d);
    setTimeout(updateNodeSizes, 100);
  }

  function renderConceptComponent(element: Element, d: d3.HierarchyNode<Concept>) {
    const foreignObject = d3
      .select(element)
      .append('foreignObject')
      .attr('width', FIXED_NODE_WIDTH)
      .attr('height', MIN_NODE_HEIGHT)
      .attr('x', -FIXED_NODE_WIDTH / 2)
      .attr('y', -MIN_NODE_HEIGHT / 2);

    const div = foreignObject
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('overflow', 'auto');

    let component;
    if (d.data.CONCEPT_TYPE_FLAG === '1') {
      component = new AtomicConcept({
        target: div.node(),
        props: { conceptData: d.data, mainFields: ['CONCEPT_DESC'], width: FIXED_NODE_WIDTH }
      });
    } else {
      component = new ComplexConcept({
        target: div.node(),
        props: {
          conceptData: d.data,
          mainFields: ['CONCEPT_DESC', 'CONCEPT_RELTN'],
          toggleChildren: () => toggleChildren(d),
          width: FIXED_NODE_WIDTH
        }
      });
    }

    component.$on('resize', () => {
      updateNodeSizes();
      updateTree(root);
    });
  }

  function handleZoom(event: CustomEvent) {
    if (svg && zoom) {
      if (event.detail.direction === 'in') {
        zoomTransform = zoomTransform.scale(1.2);
      } else if (event.detail.direction === 'out') {
        zoomTransform = zoomTransform.scale(1 / 1.2);
      } else if (event.detail.level) {
        const scale = event.detail.level / 100;
        zoomTransform = zoomTransform.scale(scale / zoomTransform.k);
      }
      svg.call(zoom.transform, zoomTransform);
      zoomLevel = Math.round(zoomTransform.k * 100);
    }
  }

  function initializeZoom() {
    zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        if (g) {
          g.attr('transform', event.transform.toString());
        }
        zoomTransform = event.transform;
        zoomLevel = Math.round(event.transform.k * 100);
      });

    svg.call(zoom);
    zoomTransform = d3.zoomIdentity;
  }
</script>

<div class="concept-tree-container">
  <div class="zoom-control-container">
    <ZoomControl {zoomLevel} on:zoom={handleZoom} />
  </div>
  <h2>Concept Tree</h2>
  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>{loadingStatus}</p>
    </div>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <div bind:this={treeContainer}></div>
  {/if}
</div>

<style>
  .concept-tree-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .zoom-control-container {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
  :global(.link) {
    fill: none;
    stroke: #ccc;
    stroke-width: 2px;
  }

  .error {
    color: red;
    font-weight: bold;
  }
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
