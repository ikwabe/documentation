<template>
  <v-app>
    <v-main>
      <div class="main"></div>
      <div class="login col-12">
        <v-container fluid>
          <v-row class="text-center fill-height" align="center">
            <v-col cols="12" sm="2" md="4"></v-col>
            <v-col cols="12" sm="8" md="4">
              <br />
              <v-card elevation="10"  style="padding: 20px;  border-radius: 20px;" align="center">
                <v-card-text>
                  <v-img src="logo.png" width="100" height="100"></v-img>
                </v-card-text>
                <h1 class=" tetx-bold">Documentation</h1>
                <p class="grey--text">This system helps you to create and read different documantations</p>
                <h3 class="grey--text">{{ title }}</h3>

                <v-form
                  @submit.prevent="onLogin"
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-text-field
                    v-model="login.username"
                    outlined
                    dense
                    color="primary"
                    error-count="2"
                    label="Username"
                    :rules="usernameRules"
                  ></v-text-field>
                  <v-text-field
                    v-model="login.password"
                    color="primary"
                    @click:append="show1 = !show1"
                    :type="show1 ? 'text' : 'password'"
                    dense
                    label="Password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    outlined
                    required
                  ></v-text-field>
                  <v-alert
                    dense
                    text
                    type="error"
                    style="color: green"
                    v-show="wrongpass"
                    >{{ message }}</v-alert
                  >

                  <v-btn
                    v-if="!isLoading"
                    block
                    :disabled="!valid"
                    color="primary"
                    class="mr-4 btn-text menu"
                    type="submit"
                    dark
                   
                  >
                    Login
                  </v-btn>
                  <v-progress-circular indeterminate v-else color="blue">
                  </v-progress-circular>
                </v-form>
              </v-card>
            </v-col>
            <v-col cols="12" sm="2" md="4"></v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>
  
<script>
export default {
  data: () => ({
    title: "Login",
    valid: true,
    show1: false,
    show2: false,
    message: null,
    isLoading: false,
    wrongpass: false,
    count: 0,
    login: {
      username: null,
      password: null,
    },
    usernameRules: [(v) => !!v || "Username is required"],
  }),

  methods: {
    //..validate inputs
    validateForm() {
      return this.$refs.form.validate();
    },
    //Login method here
    onLogin() {
      if (this.validateForm) {
        this.isLoading = true;
        this.wrongpass = false;
        let url = window.api_url + "login";
        this.$axios
          .post(url, this.login)
          .then((response) => {
            if (response.data.success) {
              this.wrongpass = false;
              localStorage.setItem("token", response.data.payload["token"]);
              localStorage.setItem("name", response.data.payload["name"]);
              localStorage.setItem("dept_id", response.data.payload["dept_id"]);

              window.location.href = "/documentation-view";
            } else {
              this.isLoading = false;
              this.wrongpass = true;
              this.count = 0;
              this.message = response.data.message;
            }
          })
          .catch((error) => {
            console.log(error);
            this.isLoading = false;
          });
      }
    },
    countDownTimer() {
      setTimeout(() => {
        if (this.count > 3) {
          this.wrongpass = false;
          this.count = 0;
        }
        this.count++;
        this.countDownTimer();
      }, 1000);
    },
  },
  created() {},
};
</script>
  
  <style scoped>
.main {
  background-image: url("/deskback.jpg");
  background-size: cover;
  filter: blur(4px);
  -webkit-filter: blur(4px);
  height: 100%;
  position: relative;
  /*box-shadow: inset 0 0 0 1000px rgba(144,19,254,0.5);

/* 
 background: rgb(176,113,238);
background: radial-gradient(circle, rgba(176,113,238,0.49343487394957986) 0%, rgba(144,19,254,1) 60%); */
}
.login {
  position: absolute;
  top: 20%;
  width: 100%;
}

@media screen and (max-width:900px) {
  .main {
  background-image: url("/mobileback.jpg");
  filter: blur(4px);
  -webkit-filter: blur(4px);
}
}
</style>
 
