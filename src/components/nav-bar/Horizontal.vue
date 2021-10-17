<template>
<div>
        <v-app-bar app elevate-on-scroll clipped-right color="white">
  
      <h3 class="ml-4 hide-on-mobile" style="color: #0847a9">{{ page_tittle }}</h3>
 <v-spacer></v-spacer>
      <v-menu
        transition="scale-transition"
        offset-y
        bottom
        max-height="300"
        open-on-hover
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar v-on="on" v-bind="attrs" color="#F5F5F5" class="margin-right">
            <!-- <v-img src="../profile.jpg"></v-img> -->
            <h3>{{ String(username).slice(0, 1) }}</h3>
          </v-avatar>
        </template>
        <v-card-text style="background-color: white">{{
          username
        }}</v-card-text>
        <v-btn block tile light elevation="0" @click="logOut()" class="menu">
        <v-icon>mdi-logout</v-icon>  Log out<v-spacer></v-spacer>
        </v-btn>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer app permanent dark color="primary">
   <v-card-title class="white--text">
     Documentation
   </v-card-title>
  <v-treeview
    hoverable
    :items="menuoption"
    activatable
    color="white"
    open-on-click
    transition
    @update:active="showOption"
  >


  </v-treeview>

    </v-navigation-drawer>
</div>
 
</template>

<script>
export default {
data:()=>({
    username:'Shedrack Ikwabe',
    panel:null,
}),

props: {
    //this prop help on the active classess for exapansion panels. For every navigation state changes
    state: {
      type: String,
      default: "customer",
    },
    //menu items
    menuoption: Array,
    //page_tittle option
    //this will displaye the page_tittle of the form loading this component
    page_tittle: {
      type: String,
      default: "",
    },


  },
methods:{
    logOut(){
      window.location.href = '/'
    },
    showOption:function(e){
      console.log(e);
    }


}
}
</script>

<style>

</style>