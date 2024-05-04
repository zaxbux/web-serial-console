<template>
  <v-dialog :modal-value="true">
    <v-card title="Error!">
      <v-card-text>
        This browser does not support the Web Serial API.
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn append-icon="mdi-arrow-right" href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serial#browser_compatibility" target="_blank" rel="noopener">
          Learn more
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
