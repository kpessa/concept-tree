import { writable } from 'svelte/store';
import * as d3 from 'd3';

export const conceptList = writable([]);
export const conceptTree = writable(null);
export const selectedConcept = writable(null);

export async function loadConceptData() {
    try {
        const response = await fetch('/data/concepts_ea.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
            throw new Error("CSV file is empty");
        }
        const rawData = d3.csvParse(text);
        if (!rawData || rawData.length === 0) {
            throw new Error("Failed to parse CSV data");
        }
        console.log('Loaded concepts:', rawData.length);
        conceptList.set(rawData);
    } catch (error) {
        console.error('Error in loadConceptData:', error);
        conceptList.set([]);
        throw error;
    }
}

export function buildConceptTree(rootId) {
    console.log(`Starting to build concept tree with root ID: ${rootId}`);
    conceptList.subscribe(concepts => {
        if (concepts.length === 0) {
            console.error('Concept list is empty. Load data first.');
            return;
        }

        console.log(`Total concepts in list: ${concepts.length}`);

        const conceptMap = new Map(concepts.map(c => [c.CONCEPT_NAME_KEY, { ...c, children: [] }]));
        console.log(`Concept map created with ${conceptMap.size} entries`);

        const rootConcept = conceptMap.get(rootId);

        if (!rootConcept) {
            console.error(`Concept with ID ${rootId} not found.`);
            return;
        }

        console.log(`Root concept found: ${rootConcept.CONCEPT_NAME}`);

        let processedNodes = new Set();

        function addChildren(node, depth = 0) {
            console.log(`Processing node: ${node.CONCEPT_NAME} at depth ${depth}`);

            if (processedNodes.has(node.CONCEPT_NAME_KEY)) {
                console.warn(`Circular reference detected for node: ${node.CONCEPT_NAME}`);
                return;
            }

            processedNodes.add(node.CONCEPT_NAME_KEY);

            const childrenReferences = (node.CONCEPT_RELTN || '').match(/\{([^}]+)\}/g) || [];
            console.log(`CONCEPT_RELTN for ${node.CONCEPT_NAME}:`, node.CONCEPT_RELTN);
            console.log(`Extracted references:`, childrenReferences);

            const children = childrenReferences.map(ref => {
                const childName = ref.slice(1, -1); // Remove curly braces
                const foundChild = concepts.find(c => 
                    c.CONCEPT_NAME === childName || c.CONCEPT_NAME_KEY === childName
                );
                console.log(`Looking for child: ${childName}, Found:`, foundChild ? foundChild.CONCEPT_NAME : 'Not found');
                return foundChild;
            }).filter(Boolean);

            console.log(`Found ${children.length} valid children for node: ${node.CONCEPT_NAME}`);

            node.children = children.map(child => {
                const childNode = conceptMap.get(child.CONCEPT_NAME_KEY);
                if (childNode) {
                    console.log(`Adding child: ${childNode.CONCEPT_NAME} to parent: ${node.CONCEPT_NAME}`);
                    addChildren(childNode, depth + 1);
                    return childNode;
                } else {
                    console.warn(`Child node not found in concept map: ${child.CONCEPT_NAME_KEY}`);
                    return null;
                }
            }).filter(Boolean);

            processedNodes.delete(node.CONCEPT_NAME_KEY);
        }

        addChildren(rootConcept);
        console.log('Finished building concept tree');
        console.log('Tree structure:', JSON.stringify(rootConcept, null, 2));

        conceptTree.set(rootConcept);
        selectedConcept.set(rootConcept);
    });
}