<template>
  <v-app>
    <horizontal-nav-bar
      :page_tittle="'Prepare Documentation'"
      :menuoption="items"
    ></horizontal-nav-bar>
    <v-main>
      <v-form ref="form" @submit.prevent="saveDocumentation">
        <v-card-text>
          <v-row class="col-12">
            <div class="col-12 col-md-4 col-lg-4 col-sm-4">
              <v-select
                outlined
                :rules="valueRules"
                dense
                :items="departments"
                v-model="new_documentation.department_id"
                label="Department"
                hide-details
                single-line
              ></v-select>
            </div>
            <div class="col-12 col-md-8 col-lg-6 col-sm-6">
              <v-text-field
                outlined
                :rules="valueRules"
                dense
                v-model="new_documentation.title"
                label="Document title"
                hide-details
                single-line
              ></v-text-field>
            </div>
            <div class="col-12 col-md-2 col-lg-2 col-sm-2">
              <v-btn
                color="primary"
                class="menu"
                elevation="0"
                block
                type="submit"
                >Save</v-btn
              >
            </div>
          </v-row>
          <p>
            You can add sections and sub sections for your documentation.
            <span class="red--text"
              >Green backgrounded part are for sections and Red backgrounded
              parts are for sub-sections</span
            >
          </p>
        </v-card-text>
        <div class="document-container">
          <v-card-text>
            <ckeditor
              v-model="new_documentation.content"
              :config="editorConfig"
              :rules="valueRules"
            ></ckeditor>
            <div
              class="section-container mt-3 ml-10"
              v-for="(sect, index) in new_documentation.sections"
              :key="index"
            >
              <v-card-text>
                <v-row class="col-12">
                  <div class="col-12 col-md-4 col-lg-4">
                    <p>Document Section {{ index + 1 }}</p>
                  </div>
                  <div class="col-12 col-md-7 col-lg-7">
                    <v-text-field
                      outlined
                      :rules="valueRules"
                      v-model="sect.title"
                      dense
                      label="Section title"
                    ></v-text-field>
                  </div>
                  <div class="col-12 col-md-1 col-lg-1">
                    <v-btn
                      outlined
                      class="menu"
                      elevation="0"
                      @click="removeSection(index)"
                      >Remove</v-btn
                    >
                  </div>
                </v-row>
                <ckeditor
                  v-model="sect.content"
                  :config="editorConfig"
                ></ckeditor>

                <div
                  class="sub-section-container mt-3 ml-10"
                  v-for="(subsect, i) in sect.sub_section"
                  :key="i"
                >
                  <v-card-text>
                    <v-row class="col-12">
                      <div class="col-12 col-md-4 col-lg-4">
                        <p>Sub Section {{ i + 1 }}</p>
                      </div>
                      <div class="col-12 col-md-7 col-lg-7">
                        <v-text-field
                          outlined
                          :rules="valueRules"
                          v-model="subsect.title"
                          dense
                          label="Sub Section title"
                        ></v-text-field>
                      </div>
                      <div class="col-12 col-md-1 col-lg-1">
                        <v-btn
                          outlined
                          class="menu"
                          elevation="0"
                          @click="removeSubSection(index, i)"
                          >Remove</v-btn
                        >
                      </div>
                    </v-row>
                    
                    <ckeditor
                      
                      v-model="subsect.content"
                      :config="editorConfig"
                      :rules="valueRules"
                    ></ckeditor>
                  
                  </v-card-text>
                </div>
                <v-row class="mt-3">
                  <v-spacer></v-spacer>
                  <v-btn
                    outlined
                    class="menu"
                    elevation="0"
                    @click="addSubSection(index)"
                    >Add sub section</v-btn
                  >
                </v-row>
              </v-card-text>
            </div>
            <v-row justify="center" class="mt-3 mb-4">
              <v-btn outlined class="menu" elevation="0" @click="addSection"
                >Add document section</v-btn
              >
            </v-row>
            <div class="text-center">
              <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
                dark
                elevation="8"
                color="red"
              >
                {{ snacktext }}
                <template v-slot:action="{ attrs }">
                  <v-btn dark icon v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-snackbar>
            </div>
          </v-card-text>
        </div>
      </v-form>
    </v-main>
  </v-app>
</template>

<script>
import facker from '../util/facker.ts'
export default {
  data: () => ({
    editorConfig: {
      contentsCss: [
        'http://cdn.ckeditor.com/4.17.1/full-all/contents.css',
        'https://ckeditor.com/docs/ckeditor4/4.17.1/examples/assets/css/classic.css'
      ],
    },
    items: [],
    valueRules: window.valueRules,
    valid: true,

    //for snackbar
    snackbar: false,
    snacktext: null,
    timeout: 5000,

    //an object for holding new documentation info
    new_documentation: {
      user_id:1,
      department_id: null,
      title: null,
      content: null,
      sections: [],
    },
    departments: [
      
    ],
  }),
  methods: {
    validateForm() {
      return this.$refs.form.validate();
    },

    saveDocumentation() {
      if (this.validateForm()) {
        facker.saveDocumentation(this.new_documentation).then(res=>{
          console.log(res.message)
          facker.getDocumentationMenu().then(res=>{
        this.items = res.data
    })
        })
      } else {
        this.snacktext = "Make sure you fill all the necessary fields";

        this.snackbar = true;
      }
    },
    addSection() {
      this.new_documentation.sections.push({
        title: null,
        content: null,
        sub_section: [],
      });
    },
    removeSection(index) {
      this.new_documentation.sections.splice(index, 1);
    },

    addSubSection(i) {
      this.new_documentation.sections[i].sub_section.push({
        title: null,
        content: null,
      });
    },

    removeSubSection(index, i) {
      this.new_documentation.sections[index].sub_section.splice(i, 1);
    },
  },
  created() {

    facker.getDepartment().then(res=>{
     this.departments = res.data
    })

    facker.getDocumentationMenu().then(res=>{
      this.items = res.data
    })
    
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.document-container {
  overflow: scroll;
  overflow-x: hidden;
  height: 70vh;
}
.section-container {
  background-color: rgba(126, 207, 126, 0.1);
}

.sub-section-container {
  background-color: rgba(240, 23, 70, 0.1);
}
</style>
