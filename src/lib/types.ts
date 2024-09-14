export interface Concept {
  CONCEPT_NAME_KEY: string;
  CONCEPT_NAME: string;
  CONCEPT_DESC: string;
  CONCEPT_TYPE_FLAG: string;
  CONCEPT_RELTN: string;
  PARENT_CONCEPT_ID?: string; // Add parent ID if necessary
  children?: Concept[];        // For tree structure
  [key: string]: any;          // Allow for any additional properties
}