<script lang="ts">
  import ConceptCard from './ConceptCard.svelte';

  const conceptData: Record<string, string> = {
    CUST_CONCEPT_ID: "2278783",
    CONCEPT_NAME: "Active VAP Care Plan",
    CONCEPT_NAME_KEY: "ACTIVEVAPCAREPLAN",
    CONCEPT_DESC: "Patients with an active care plan for VAP",
    CONCEPT_TYPE_FLAG: "1",
    CONCEPT_RELTN: "",
    EXPIRE_LOOKAHEAD: "",
    EXPIRE_ON_DISCHARGE: "1",
    MULTIPLE_ENTRY_IND: "0",
    UPDT_ID: "25619018",
    UPDT_DT_TM: "12/02/14",
    UPDT_CNT: "0",
    UPDT_APPLCTX: "2063369294"
  };

  const mainFields = ['CONCEPT_DESC'];
</script>

<ConceptCard {conceptData} {mainFields} />

