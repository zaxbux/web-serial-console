<script setup lang="ts">
</script>
<template>
  <v-dialog persistent :model-value="true">
    <v-card title="Error!">
      <v-card-text>
        <p>This browser does not support the Web Serial API.</p>

        <p>Supported browsers</p>
        <ul>
          <li><a href="https://www.google.com/chrome/" target="_blank" rel="noopener">Chrome ≥89</a></li>
          <li><a href="https://hacks.mozilla.org/2026/05/web-serial-support-in-firefox/" target="_blank" rel="noopener">Firefox ≥151</a></li>
        </ul>

        <p>Want support in your browser?</p>
        <ul>
          <li><a href="https://github.com/WebKit/standards-positions/issues/199" target="_blank" rel="noopener">Safari</a></li>
        </ul>
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
