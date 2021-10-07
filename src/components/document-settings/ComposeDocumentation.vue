<template>
  <v-app>
   <horizontal-nav-bar></horizontal-nav-bar>
    <v-main>


      <v-card-text>

        <ckeditor v-model="editorData" :config="editorConfig"></ckeditor>
      </v-card-text>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data:()=>({
    editorData: '<p>Content of the editor.</p>',
                editorConfig: {
                    // The configuration of the editor.
                }
  })

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
