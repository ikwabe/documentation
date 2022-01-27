<template>
  <v-app>
    <horizontal-nav-bar
      :page_tittle="'Prepare Documentation'"
      :menuoption="items"
    ></horizontal-nav-bar>
    <v-navigation-drawer app dark color="primary">
      <v-card-title class="white--text"> Documentation </v-card-title>

      <v-treeview
        hoverable
        :items="menucontent"
        item-children="document"
        activatable
        color="white"
        open-on-click
        return-object
        transition
        @click.stop=""
      >
        <template slot="label" slot-scope="{ item }">
          <a style="color: white" @click="showItem(item)">{{ item.name }}</a>
        </template></v-treeview
      ></v-navigation-drawer
    >
    <v-dialog persistent v-model="overlay">
      <v-row justify="center">
        <div class="col-10 col-md-6 col-sm-8 col-lg-6">
          <v-progress-linear
            color="primary"
            indeterminate
            rounded
            height="10"
          ></v-progress-linear>
        </div>
      </v-row>
    </v-dialog>
    <v-main class="main">
      <div>
        <v-col v-if="!isLoading" class="other-pannel">
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
                    >Green backgrounded part are for sections and Red
                    backgrounded parts are for sub-sections</span
                  >
                </p>
              </v-card-text>
            </v-card>
            <div class="document-container">
              <v-card-text
                v-for="(doc, docindex) in documentation"
                :key="docindex"
              >
                <div class="col-12" align="right" v-if="docindex > 0">
                  <v-btn
                    text
                    color="error"
                    class="menu"
                    elevation="0"
                    @click="removeMainSection(docindex)"
                    >Remove</v-btn
                  >
                </div>
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
                          @keyup="cacheData"
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
                      :rules="valueRules"
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
                              @keyup="cacheData"
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
        <center v-else class="other-pannel">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </center>
      </div>
      <div class="col-12 col-md-6 col-lg-6 search-panel">
        <v-card-text>
          <v-text-field
            light
            solo
            v-model="search"
            dense
            placeholder="Search document"
            append-icon="mdi-magnify"
            hide-details=""
            style="
              border-bottom-left-radius: 0px;
              border-bottom-right-radius: 0px;
            "
            @keyup="searchDocument"
          ></v-text-field>
          <v-card tile v-show="searched.length > 0" elevation="1">
            <v-btn
              class="menu"
              @click="showItem(doc)"
              v-for="(doc, index) in searched"
              :key="index"
              text
              block
              tile
              >{{ doc.name }} <v-spacer></v-spacer
            ></v-btn>
          </v-card>
        </v-card-text>
      </div>
    </v-main>
  </v-app>
</template>

<script>

var timeIntervalID;
export default {
  data: () => ({
    editorConfig: {
      // contentsCss: [
      //   "http://cdn.ckeditor.com/4.17.1/full-all/contents.css",
      //   "https://ckeditor.com/docs/ckeditor4/4.17.1/examples/assets/css/classic.css",
      // ],
      //src/components/document-settings/upload.php
      filebrowserBrowseUrl: 'ckfinder/ckfinder.html',
      filebrowserImageBrowseUrl: 'ckfinder/ckfinder.html?type=Images',
      filebrowserUploadUrl: 'ckfinder/core/connector/php/connector.php',
      filebrowserImageUploadUrl: 'ckfinder/core/connector/php/connector.php',

    },
    items: [],
    valueRules: window.valueRules,
    valid: true,
    isLoading: false,
    overlay: true,
    //for snackbar
    snackbar: false,
    snacktext: null,
    search: null,
    searched: [],
    view_document:null,
    timeout: 5000,
    menucontent: [],
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
    showItem(item) {
      if (item) {
        if (item.doc_index >= 0) {
          item;
          this.searched = [];
          localStorage.setItem("view-document", JSON.stringify(item));
          window.location.href = "/documentation-view"
        }
      }
    },

    validateForm() {
      return this.$refs.form.validate();
    },
    showid(e) {
      console.log(e);
    },
    getDocuments() {
      this.overlay = true;
      let url = window.api_url + "get-documents";
      this.$axios
        .get(url)
        .then((response) => {
          if (response.data.success) {
            this.documents = response.data.payload;
            this.menucontent = this.documents;
            this.overlay = false;
          }
        })
        .catch(() => {
          this.overlay = false;
        });
    },
    saveDocumentation() {
      if (this.validateForm()) {
        this.saveDocument();
      } else {
        this.snacktext = "Make sure you fill all the necessary fields";

        this.snackbar = true;
      }
    },
    cacheData() {
      localStorage.setItem("temp-document", JSON.stringify(this.documentation));
    },
    setTimeIntervalForCaching() {
      timeIntervalID = setInterval(() => {
        this.cacheData();
      }, 5000);
    },
    addMainSection() {
      this.documentation.push({
        title: null,
        content: null,
        sections: [],
      });
    },
    removeMainSection(docindex) {
      this.documentation.splice(docindex, 1);
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
    searchDocument(e) {
      this.searched = [];
      let documents = [];
      this.menucontent.forEach((element) => {
        if (element.document != null && element.document.length > 0) {
          element.document.forEach((el) => {
            documents.push(el);
          });
        }
      });

      this.searched = documents.filter((doc) =>
        String(doc.name)
          .toLowerCase()
          .includes(String(e.target._value).toLowerCase())
      );
      if (String(e.target._value) == null || String(e.target._value) == "")
        this.searched = [];
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
  destroyed() {
    clearInterval(timeIntervalID);
  },
  created() {
    this.getDocuments();

    if (JSON.parse(localStorage.getItem("temp-document"))) {
      this.documentation = JSON.parse(localStorage.getItem("temp-document"));
    }
    this.setTimeIntervalForCaching();
  },
};
export class UploadAdapter
{ 
  
    constructor (loader)
    {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload ()
    {
        return this.loader.file
           .then( file => new Promise( ( resolve, reject ) => {
                 var myReader= new FileReader();
                 myReader.onloadend = () => {
                    resolve({ default: myReader.result });
                 }

                 myReader.readAsDataURL(file);

                 console.log(reject)
           } ) );
    }

    // Aborts the upload process.
    abort ()
    {
         //
    }
}

export const uploader = function (editor)
{
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) =>
        new UploadAdapter(loader);
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

.main {
  position: relative;
}
.search-pannel {
  position: absolute;
  left: 10px;
  top: 10px;
}
.other-pannel {
  position: absolute;
  left: 10px;
  top: 10%;
}
</style>
