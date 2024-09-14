<script lang="ts">
  import { onMount, tick } from 'svelte';
  import * as d3 from 'd3';
  import type { HierarchyNode } from 'd3-hierarchy';
  import { conceptData, loadConceptData } from '$lib/stores/conceptStore';
  import ZoomControl from './ZoomControl.svelte';
  import AtomicConcept from './AtomicConcept.svelte';
  import ComplexConcept from './ComplexConcept.svelte';

  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  let treeContainer: HTMLDivElement;
  let error: string | null = null;
  let zoomLevel = 100;
  let root: HierarchyNode<any>;

  const MIN_NODE_WIDTH = 400;
  const MIN_NODE_HEIGHT = 300;
  const MIN_HORIZONTAL_SPACING = 100;
  const MIN_VERTICAL_SPACING = 100;

  let updateTree: (source: HierarchyNode<any>) => void;

  onMount(async () => {
    try {
      await loadConceptData();
      if ($conceptData) {
        console.log('Concept data loaded:', $conceptData);
        await tick();
        renderTree($conceptData);
      } else {
        error = 'No data available to render';
      }
    } catch (e) {
      console.error('Error loading or processing data:', e);
      error = `Error: ${e instanceof Error ? e.message : 'Unknown error'}. Check the console for more details.`;
    }
  });

  function renderTree(data: any) {
    if (!data) {
      error = 'No data available to render';
      return;
    }

    const width = 3000;
    const height = 2000;
    const margin = { top: 100, right: 120, bottom: 40, left: 120 };

    const treemap = d3.tree<any>().nodeSize([MIN_NODE_WIDTH + MIN_HORIZONTAL_SPACING, MIN_NODE_HEIGHT + MIN_VERTICAL_SPACING]);

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

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event: d3.ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr('transform', event.transform.toString());
        zoomLevel = Math.round(event.transform.k * 100);
      });

    svg.call(zoom);

    updateTree = (source: HierarchyNode<any>) => {
      const treeData = treemap(root);
      const nodes = treeData.descendants();
      const links = treeData.links();

      nodes.forEach((d: any) => {
        d.y = d.depth * (MIN_NODE_HEIGHT + MIN_VERTICAL_SPACING);
      });

      const node = g.selectAll<SVGGElement, HierarchyNode<any>>('g.node')
        .data(nodes, (d: any) => d.data.CUST_CONCEPT_ID);

      const nodeEnter = node.enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', (d: any) => `translate(${source.x0},${source.y0})`);

      nodeEnter.each(function (this: Element, d: HierarchyNode<any>) {
        renderConceptComponent(this, d);
      });

      const nodeUpdate = nodeEnter.merge(node as any);

      nodeUpdate.transition()
        .duration(750)
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

      node.exit().remove();

      const link = g.selectAll<SVGPathElement, d3.HierarchyLink<any>>('path.link')
        .data(links, (d: any) => d.target.data.CUST_CONCEPT_ID);

      const linkEnter = link.enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', d3.linkVertical<any, any>()
          .x((d: any) => d.x)
          .y((d: any) => d.y));

      link.merge(linkEnter as any).transition()
        .duration(750)
        .attr('d', d3.linkVertical<any, any>()
          .x((d: any) => d.x)
          .y((d: any) => d.y));

      link.exit().remove();

      nodes.forEach((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    };

    updateTree(root);

    // After initial render, update node sizes based on actual content
    setTimeout(() => {
      updateNodeSizes();
      updateTree(root);
    }, 1000); // Increased timeout to allow more time for content to render
  }

  function updateNodeSizes() {
    svg.selectAll('g.node').each(function(d: any) {
      const foreignObject = d3.select(this).select('foreignObject');
      const div = foreignObject.select('div');
      const contentHeight = div.node().scrollHeight;
      const contentWidth = div.node().scrollWidth;

      d.height = Math.max(contentHeight + 40, MIN_NODE_HEIGHT); // Add padding
      d.width = Math.max(contentWidth + 40, MIN_NODE_WIDTH); // Add padding

      foreignObject
        .attr('width', d.width)
        .attr('height', d.height)
        .attr('x', -d.width / 2)
        .attr('y', -d.height / 2);

      div.style('width', `${d.width}px`)
         .style('height', `${d.height}px`);
    });

    const treemap = d3.tree<any>().nodeSize([
      d3.max(root.descendants(), (d: any) => d.width) + MIN_HORIZONTAL_SPACING,
      d3.max(root.descendants(), (d: any) => d.height) + MIN_VERTICAL_SPACING
    ]);

    treemap(root);
  }

  function toggleChildren(d: HierarchyNode<any>) {
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

  function renderConceptComponent(element: Element, d: HierarchyNode<any>) {
    const foreignObject = d3
      .select(element)
      .append('foreignObject')
      .attr('width', MIN_NODE_WIDTH)
      .attr('height', MIN_NODE_HEIGHT)
      .attr('x', -MIN_NODE_WIDTH / 2)
      .attr('y', -MIN_NODE_HEIGHT / 2);

    const div = foreignObject
      .append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('overflow', 'auto');

    let component;
    if (d.data.CONCEPT_TYPE_FLAG === 1) {
      component = new AtomicConcept({
        target: div.node(),
        props: { conceptData: d.data, mainFields: ['CONCEPT_DESC'] }
      });
    } else {
      component = new ComplexConcept({
        target: div.node(),
        props: {
          conceptData: d.data,
          mainFields: ['CONCEPT_DESC', 'CONCEPT_RELTN'],
          toggleChildren: () => toggleChildren(d)
        }
      });
    }

    component.$on('resize', () => {
      updateNodeSizes();
      updateTree(root);
    });
  }

  function handleZoom(event: CustomEvent) {
    const svgElement = svg.node();
    if (svgElement) {
      const zoom = d3.zoom<SVGSVGElement, unknown>();
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

  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 3px;
  }
  .error {
    color: red;
    font-weight: bold;
  }
</style>
