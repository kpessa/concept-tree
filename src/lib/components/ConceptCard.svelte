<script>
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Label,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Textarea,
    Checkbox
  } from '$lib/components/ui';

  let conceptType = "";
  let conceptName = "";
  let description = "";
  let complexExpression = "";
  let expireLookahead = "";
  let expireOnDischarge = false;
  let multiRow = false;

  
</script>

<Card class="w-[600px]">
  <CardHeader>
    <CardTitle>Discern Prompt: Concept Builder</CardTitle>
  </CardHeader>
  <CardContent>
    <form>
      <div class="grid w-full items-center gap-4">
        <div class="flex flex-col space-y-1.5">
          <Label for="conceptType">Concept Type</Label>
          <Select onSelectedChange={(event) => conceptType = event?.value}>
            <SelectTrigger id="conceptType">
              <SelectValue placeholder="Select concept type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Atomic">Atomic</SelectItem>
              <SelectItem value="Complex">Complex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex flex-col space-y-1.5">
          <Label for="conceptName">Concept Name</Label>
          <Input id="conceptName" bind:value={conceptName} />
        </div>
        <div class="flex flex-col space-y-1.5">
          <Label for="description">Description</Label>
          <Textarea id="description" bind:value={description} />
        </div>
        {#if conceptType === "Atomic"}
          <div class="flex flex-col space-y-1.5">
            <Label for="expireLookahead">Expire Lookahead</Label>
            <Input id="expireLookahead" bind:value={expireLookahead} />
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="expireOnDischarge" bind:checked={expireOnDischarge} />
            <Label for="expireOnDischarge">Expire on Discharge</Label>
          </div>
          <div class="flex items-center space-x-2">
            <Checkbox id="multiRow" bind:checked={multiRow} />
            <Label for="multiRow">Multi Row</Label>
          </div>
        {:else if conceptType === "Complex"}
          <div class="flex flex-col space-y-1.5">
            <Label for="complexExpression">Complex Expression</Label>
            <Textarea id="complexExpression" bind:value={complexExpression} />
          </div>
        {/if}
      </div>
    </form>
  </CardContent>
</Card>