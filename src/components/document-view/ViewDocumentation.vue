<template>
  <v-app>
    <horizontal-nav-bar
      :page_tittle="'View Documentation'"
      :menuoption="menucontent"
    ></horizontal-nav-bar>
    <v-navigation-drawer app dark color="primary">
      <v-card-title class="white--text"> Documentation </v-card-title>
      <v-btn
        block
        href="/create-documentation"
        color="purple"
        tile
        dark
        class="menu mb-3"
      >
        <v-icon>mdi-plus</v-icon> Create Documentation</v-btn
      >

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
    <v-main class="main">
      <v-container class="other-pannel">
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

        <v-col align="end" v-if="view_document">
      
          <v-menu
         
            transition="scale-transition"
            offset-y
            bottom
            max-height="300"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                color="purple"
                dark
                class="menu"
                elevation="0"
                >Download Doc <v-spacer></v-spacer
                ><v-icon>mdi-menu-down</v-icon></v-btn
              >
            </template>
            <v-btn block elevation="0" @click="generateReport" class="menu" tile
              ><v-icon>mdi-file-pdf-outline</v-icon> PDF format
              <v-spacer></v-spacer
            ></v-btn>
            <v-btn block elevation="0" class="menu" tile
              ><v-icon>mdi-code-braces</v-icon> HTML format<v-spacer></v-spacer
            ></v-btn>
          </v-menu>
          <v-progress-circular
      :rotate="90"
      :size="40"
      :width="5"
      v-if="value > 0 && value <= 99"
      :value="value"
      color="purple"
      class="ml-3"
    >
      {{ value }}
    </v-progress-circular>
        </v-col>

        <v-col v-if="view_document" cols="12" sm="10" lg="8" md="8">
          <h1 v-if="view_document">{{ view_document.name }}</h1>

          <v-col v-for="(sect, index) in view_document.content" :key="index">
            <v-col v-html="sect.contents"></v-col>
            <v-col v-for="(sect2, index2) in sect.sections" :key="index2">
              <v-col class="ml-3" v-html="sect2.contents"></v-col>
              <v-col
                v-for="(sect3, index3) in sect2.sub_sections"
                :key="index3"
              >
                <v-col class="ml-4" v-html="sect3.contents"></v-col>
              </v-col>
            </v-col>
          </v-col>
        </v-col>

        <v-col v-else align="left" v-html="content"> </v-col>
      </v-container>
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
        <vue-html2pdf
          :show-layout="false"
          :float-layout="true"
          :enable-download="false"
          :preview-modal="true"
          :paginate-elements-by-height="1400"
          :filename="view_document == null ? 'no name' : view_document.name"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a4"
          
          :margin="5"
          @progress="onProgress($event)"
          @hasStartedGeneration="hasStartedGeneration()"
          @hasGenerated="hasGenerated($event)"
          ref="html2Pdf"
        >
          <section v-if="view_document" slot="pdf-content">
            <!-- PDF Content Here -->
            <v-card-text>
              <v-col
                v-for="(sect, index) in view_document.content"
                :key="index"
               
              >
                <v-col v-html="sect.contents"></v-col>
                <v-col v-for="(sect2, index2) in sect.sections" :key="index2">
                  <v-col class="ml-3" v-html="sect2.contents"></v-col>
                  <v-col
                    v-for="(sect3, index3) in sect2.sub_sections"
                    :key="index3"
                  >
                    <v-col class="ml-4" v-html="sect3.contents"></v-col>
                  </v-col>
                </v-col>
              </v-col>
            </v-card-text>
          </section>
        </vue-html2pdf>
      </div>
    </v-main>
  </v-app>
</template>
  

<script>
// import facker from "../util/facker.ts";
import VueHtml2pdf from "vue-html2pdf";
export default {
  data: () => ({
    search: null,
    username: "Shedrack Ikwabe",
    panel: null,
    value:0,
    documents: [],
    searched: [],
    overlay: false,
    menucontent: [],
    page_tittle: "",
    selected_index: 0,
    sections: [],
    view_document: null,
    items: [],
    content: "<h4>No document to display</h4>",
  }),
  methods: {
    showItem(item) {
      if (item) {
        if (item.doc_index >= 0) {
          this.view_document = item;
          this.searched = [];
          // this.page_tittle = item.name;
          // this.content = this.documents[item.doc_index].content;
          // this.selected_index = item.doc_index;
          // this.sections = this.documents[this.selected_index].sections;
        }
      }
    },
    showOption: function (e) {
      console.log(e);
    },

    getDocuments() {
      this.isLoading = true;
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
          this.isLoading = false;
          this.overlay = false;
        });
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
    onProgress:function(e){
      this.value = e;
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  components: {
    VueHtml2pdf,
  },
  created() {
    this.getDocuments();

    // facker.getDocumentationMenu().then((res) => {
    //   if (res && res.data) this.items = res.data;
    // });

    // facker.getDocumentations().then((res) => {
    //   if (res && res.data) {
    //     this.documents = res.data;
    //     this.content = res.data[this.selected_index].content;
    //     this.page_tittle = res.data[this.selected_index].title;

    //     this.sections = this.documents[this.selected_index].sections;
    //   }
    // });
  },
};
</script>

<style scoped>
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