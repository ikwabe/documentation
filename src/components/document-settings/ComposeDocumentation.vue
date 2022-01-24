<template>
  <v-app>
    <horizontal-nav-bar
      :page_tittle="'Prepare Documentation'"
      :menuoption="items"
    ></horizontal-nav-bar>
    <v-main>
      <v-col v-if="!isLoading">
        <v-form ref="form" @submit.prevent="saveDocumentation">
          <v-card tile>
            <v-card-text>
              <v-row class="col-12">
                <!-- <div class="col-12 col-md-4 col-lg-4 col-sm-4">
              <v-select
                outlined
                :rules="valueRules"
                dense
                :items="departments"
                item-value="id"
                item-text="name"
                v-model="department_id"
                label="Department"
                hide-details
               
                single-line
              ></v-select>
            </div> -->
                <div class="col-12 col-md-8 col-lg-6 col-sm-6">
                  <v-text-field
                    outlined
                    :rules="valueRules"
                    dense
                    v-model="documentation_title"
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
          </v-card>
          <div class="document-container">
            <v-card-text
              v-for="(doc, docindex) in documentation"
              :key="docindex"
            >
              <ckeditor
                v-model="doc.content"
                :config="editorConfig"
                :rules="valueRules"
              ></ckeditor>
              <div
                class="section-container mt-3 ml-10"
                v-for="(sect, index) in doc.sections"
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
                        text
                        color="error"
                        elevation="0"
                        class="menu"
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
                            text
                            color="error"
                            class="menu"
                            elevation="0"
                            @click="removeSubSection(docindex, index, i)"
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
                      text
                      class="menu"
                      elevation="0"
                      color="purple"
                      @click="addSubSection(docindex, index)"
                      >Add sub sub section</v-btn
                    >
                  </v-row>
                </v-card-text>
              </div>
              <v-row justify="center" class="mt-3 mb-4">
                <v-btn
                  text
                  color="purple"
                  class="menu"
                  elevation="0"
                  @click="addSection(docindex)"
                  >Add sub section</v-btn
                >
              </v-row>
              <div class="text-center">
                <v-snackbar
                  v-model="snackbar"
                  :timeout="timeout"
                  dark
                  top
                  elevation="8"
                  color="error"
                >
                  {{ snacktext }}
                  <template v-slot:action="{ attrs }">
                    <v-btn dark icon v-bind="attrs" @click="snackbar = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                </v-snackbar>
              </div>
              <v-row justify="start" class="mt-3 mb-4 ml-3">
                <v-btn
                  text
                  class="menu"
                  color="purple"
                  elevation="0"
                  @click="addMainSection"
                  >Add main section</v-btn
                >
              </v-row>
            </v-card-text>
          </div>
        </v-form>
      </v-col>
      <center v-else>
        <v-progress-circular  indeterminate color="primary" ></v-progress-circular>
      </center>
    </v-main>
  </v-app>
</template>

<script>
import facker from "../util/facker.ts";
export default {
  data: () => ({
    editorConfig: {
      contentsCss: [
        "http://cdn.ckeditor.com/4.17.1/full-all/contents.css",
        "https://ckeditor.com/docs/ckeditor4/4.17.1/examples/assets/css/classic.css",
      ],
    },
    items: [],
    valueRules: window.valueRules,
    valid: true,
    isLoading: false,

    //for snackbar
    snackbar: false,
    snacktext: null,
    timeout: 5000,
    documentation_title: null,
    department_id: window.dept_id,
    documentation: [
      {
        content: null,
        sections: [],
      },
    ],
    //an object for holding new documentation info

    departments: [],
  }),
  methods: {
    validateForm() {
      return this.$refs.form.validate();
    },
    showid(e) {
      console.log(e);
    },
    saveDocumentation() {
      if (this.validateForm()) {
        this. saveDocument();
      } else {
        this.snacktext = "Make sure you fill all the necessary fields";

        this.snackbar = true;
      }
    },
    addMainSection() {
      this.documentation.push({
        title: null,
        content: null,
        sections: [],
      });
    },
    addSection(index) {
      this.documentation[index].sections.push({
        title: null,
        content: null,
        sub_section: [],
      });
    },
    removeSection(index) {
      this.documentation[index].sections.splice(index, 1);
    },

    addSubSection(index, i) {
      this.documentation[index].sections[i].sub_section.push({
        title: null,
        content: null,
      });
    },

    removeSubSection(docindex, index, i) {
      this.documentation[docindex].sections[index].sub_section.splice(i, 1);
    },
    getDepartiments() {
      this.isLoading = true;

      let url = window.api_url + "get-departiments";
      this.$axios
        .get(url)
        .then((response) => {
          if (response.data.success) {
            this.departments = response.data.payload;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    saveDocument() {
      this.isLoading = true;

      let url = window.api_url + "add-document";
      this.$axios
        .post(url, {
          document: JSON.stringify(this.documentation),
          dept_id: this.department_id,
          title: this.documentation_title,
        })
        .then((response) => {
          if (response.data.success) {
           this.isLoading = false;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    //this.getDepartiments();
    facker.getDocumentationMenu().then((res) => {
      this.items = res.data;
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.document-container {
  overflow: scroll;
  overflow-x: hidden;
  height: 75vh;
}
.section-container {
  background-color: rgba(126, 207, 126, 0.1);
}

.sub-section-container {
  background-color: rgba(240, 23, 70, 0.1);
}
</style>
