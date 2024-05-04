<template>
  <v-dialog persistent :model-value="true">
    <v-card title="Error!">
      <v-card-text>
        <p>This browser does not support the Web Serial API.</p>

        <p>Want support in your browser?</p>
        <ul>
          <li><a href="https://connect.mozilla.org/t5/discussions/fully-support-web-usb-and-web-serial/m-p/62">Firefox</a></li>
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
