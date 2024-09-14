import { writable, get } from 'svelte/store';
import * as d3 from 'd3';
import type { Concept } from '$lib/types';

export const conceptList = writable<Concept[]>([]);
export const conceptTree = writable<Concept | null>(null);
export const selectedConcept = writable<Concept | null>(null);

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
        const rawData = d3.csvParse(text) as unknown as Concept[];
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

function extractRelatedConcepts(expression: string): string[] {
    const regex = /\{([^}]+)\}/g;
    const matches = expression.match(regex);
    if (matches) {
        console.log('Matches found:', matches.join(', '));
        return matches.map(match => match.slice(1, -1));
    }
    return [];
}

export function buildConceptTree(rootId: string) {
    console.log(`Starting to build concept tree with root ID: ${rootId}`);
    const concepts = get(conceptList);
    if (concepts.length === 0) {
        console.error('Concept list is empty. Load data first.');
        return;
    }

    console.log(`Total concepts in list: ${concepts.length}`);

    const conceptMap = new Map(concepts.map(c => [c.CONCEPT_NAME_KEY, { ...c, children: [] as Concept[] }]));
    console.log(`Concept map created with ${conceptMap.size} entries`);

    const rootConcept = conceptMap.get(rootId);

    if (!rootConcept) {
        console.error(`Concept with ID ${rootId} not found.`);
        return;
    }

    console.log(`Root concept found: ${rootConcept.CONCEPT_NAME}`);

    let processedNodes = new Set<string>();

    function addChildren(node: Concept, depth = 0): Concept {
        console.log(`Processing node: ${node.CONCEPT_NAME} at depth ${depth}`);

        if (processedNodes.has(node.CONCEPT_NAME_KEY)) {
            console.warn(`Circular reference detected for node: ${node.CONCEPT_NAME}`);
            return { ...node, children: [] };
        }

        processedNodes.add(node.CONCEPT_NAME_KEY);

        const relatedConceptKeys = extractRelatedConcepts(node.CONCEPT_RELTN);
        console.warn(relatedConceptKeys);
        console.log(`Found ${relatedConceptKeys.length} related concepts for node: ${node.CONCEPT_NAME}`);
        console.log(`Related concept keys:`, relatedConceptKeys);

        const children = relatedConceptKeys.map(key => {
            const childNode = conceptMap.get(key) || concepts.find(c => c.CONCEPT_NAME === key);
            if (childNode) {
                console.log(`Adding child: ${childNode.CONCEPT_NAME} to parent: ${node.CONCEPT_NAME}`);
                return addChildren(childNode, depth + 1);
            } else {
                console.warn(`Child node not found: ${key}`);
                console.log(`Concepts with similar names:`, concepts.filter(c => 
                    c.CONCEPT_NAME.toLowerCase().includes(key.toLowerCase()) || 
                    c.CONCEPT_NAME_KEY.toLowerCase().includes(key.toLowerCase())
                ).map(c => `${c.CONCEPT_NAME} (${c.CONCEPT_NAME_KEY})`));
                
                // Create a placeholder node for missing concepts
                return {
                    CONCEPT_NAME: key,
                    CONCEPT_NAME_KEY: key,
                    CONCEPT_DESC: 'Placeholder for missing concept',
                    CONCEPT_TYPE_FLAG: '1',
                    CONCEPT_RELTN: '',
                    children: []
                } as Concept;
            }
        });

        processedNodes.delete(node.CONCEPT_NAME_KEY);

        return { ...node, children };
    }

    const processedRootConcept = addChildren(rootConcept);
    console.log('Finished building concept tree');
    
    // Use a custom replacer function to handle circular references
    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key: string, value: any) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return '[Circular Reference]';
                }
                seen.add(value);
            }
            return value;
        };
    };

    console.log('Tree structure:', JSON.stringify(processedRootConcept, getCircularReplacer(), 2));

    conceptTree.set(processedRootConcept);
    selectedConcept.set(processedRootConcept);
}