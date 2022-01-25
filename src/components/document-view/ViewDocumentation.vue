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
    <v-main>
      <v-container>
        <div class="col-12 col-md-6 col-lg-6">
          <v-card-text>
            <v-text-field
              outlined
              light
              v-model="search"
              dense
              placeholder="Search"
              hide-details=""
            ></v-text-field>
          </v-card-text>
        </div>
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
            <v-btn block elevation="0" class="menu" tile
              ><v-icon>mdi-file-pdf-outline</v-icon> PDF format
              <v-spacer></v-spacer
            ></v-btn>
            <v-btn block elevation="0" class="menu" tile
              ><v-icon>mdi-code-braces</v-icon> HTML format<v-spacer></v-spacer
            ></v-btn>
          </v-menu>
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
    </v-main>
  </v-app>
</template>
  

<script>
// import facker from "../util/facker.ts";
export default {
  data: () => ({
    search: null,
    username: "Shedrack Ikwabe",
    panel: null,
    documents: [],
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
          console.log(item);
          this.view_document = item;
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

      let url = window.api_url + "get-documents";
      this.$axios
        .get(url)
        .then((response) => {
          if (response.data.success) {
            this.documents = response.data.payload;
            this.menucontent = this.documents;
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
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

<style>
</style>