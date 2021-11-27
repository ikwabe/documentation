<template>
  <v-app>
    <v-app-bar app elevate-on-scroll clipped-right color="white">
      <h3 class="ml-4 hide-on-mobile" style="color: #0847a9">
        {{ page_tittle }} Documentation
      </h3>
      <v-spacer></v-spacer>
      <v-menu 
      transition="scale-transition"
        offset-y
        bottom
        max-height="300"
        
        >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-on="on" v-bind="attrs" color="purple" dark class="menu" elevation="0">Download Doc <v-spacer></v-spacer><v-icon>mdi-menu-down</v-icon></v-btn>

        </template>
        <v-btn block elevation="0" class="menu" tile><v-icon>mdi-file-pdf-outline</v-icon> PDF format <v-spacer></v-spacer></v-btn>
        <v-btn block elevation="0" class="menu" tile><v-icon>mdi-code-braces</v-icon> HTML format<v-spacer></v-spacer></v-btn>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer app permanent dark color="primary">
      <v-card-title class="white--text"> Documentation </v-card-title>
      <v-treeview
        hoverable
        :items="items"
        activatable
        color="white"
        open-on-click
        return-object
        transition
      >
        <template slot="label" slot-scope="{ item }">
          <a style="color: white" @click="showItem(item)">{{ item.name }}</a>
        </template></v-treeview
      ></v-navigation-drawer
    >
    <v-main>
      
      <v-container>
        <center>
      <v-col cols="12" sm="10" lg="8" md="8">
      <v-col align="left"  v-html="content">

      </v-col>
      <v-col v-for="(sect, index) in sections" :key="index" v-html="sect.content">
      </v-col>
      </v-col>
        </center>
      </v-container>
    </v-main>
    
    </v-app
  >
</template>
  

<script>
import facker from "../util/facker.ts";
export default {
  data: () => ({
    username: "Shedrack Ikwabe",
    panel: null,
    documents: [],
    page_tittle: "",
    selected_index:0,
    sections:[],
    items: [],
    content: "<h4>No document to display</h4>",
  }),
  methods: {
    showItem(item) {
      if(item){
       
        if(item.doc_index >= 0 ){
        this.page_tittle = item.name;
        this.content = this.documents[item.doc_index].content;
        this.selected_index = item.doc_index;
        this.sections = this.documents[this.selected_index].sections;
        }
      }

      
    },
    showOption: function (e) {
      console.log(e);
    },
  },
  created() {
  
    facker.getDocumentationMenu().then((res) => {
      if (res && res.data) this.items = res.data;
    });

    facker.getDocumentations().then((res) => {
      if (res && res.data) {
        this.documents = res.data;
        this.content = res.data[this.selected_index].content;
        this.page_tittle = res.data[this.selected_index].title;

        this.sections = this.documents[this.selected_index].sections;
      }
    });
  },
};
</script>

<style>
</style>