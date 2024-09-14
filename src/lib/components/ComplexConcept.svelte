<script lang="ts">
  import ConceptCard from './ConceptCard.svelte';

  const conceptData: Record<string, string> = {
    CUST_CONCEPT_ID: "5693614",
    CONCEPT_NAME: "Patients with PU and no care plan",
    CONCEPT_NAME_KEY: "PATIENTSWITHPUANDNOCAREPLAN",
    CONCEPT_DESC: "Patients with a documented pressure ulcer (based on wound type of pressure ulcer) OR at high risk of developing a pressure ulcer but without an appropriate care plan",
    CONCEPT_TYPE_FLAG: "2",
    CONCEPT_RELTN: "({WOUNDSPRESENTONADMISSION}.COUNT > 0 OR {PUHIGHPURISK}) AND {ACTIVEPRESSUREULCERCAREPLAN}.COUNT = 0",
    EXPIRE_LOOKAHEAD: "",
    EXPIRE_ON_DISCHARGE: "0",
    MULTIPLE_ENTRY_IND: "0",
    UPDT_ID: "747930",
    UPDT_DT_TM: "04/03/15",
    UPDT_CNT: "0",
    UPDT_APPLCTX: "161471722"
  };

  const mainFields = [ 'CONCEPT_NAME_KEY', 'CONCEPT_DESC', 'CONCEPT_RELTN'];
</script>

<ConceptCard {conceptData} {mainFields} />