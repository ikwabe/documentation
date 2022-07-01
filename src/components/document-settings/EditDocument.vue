<template>
    <v-app>

        <v-app-bar app elevate-on-scroll clipped-right color="white">
            <v-app-bar-nav-icon @click="nav_model = !nav_model"></v-app-bar-nav-icon>
            <h3 class="ml-4 hide-on-mobile" style="color: #0847a9">Edit Documentation</h3>
            <v-spacer></v-spacer>

            <v-menu transition="scale-transition" offset-y bottom max-height="300" open-on-hover>
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
                    <v-icon>mdi-logout</v-icon> Log out<v-spacer></v-spacer>
                </v-btn>
            </v-menu>
        </v-app-bar>

        <v-navigation-drawer v-model="nav_model" app dark color="primary">
            <v-card-title class="white--text"> Knowledge Base </v-card-title>

            <v-treeview hoverable :items="menucontent" item-children="document" activatable color="white" open-on-click
                return-object transition @click.stop="">
                <template slot="label" slot-scope="{ item }">
                    <a style="color: white" @click="showItem(item)">{{ item.name }}</a>
                </template>
            </v-treeview>
        </v-navigation-drawer>
        <v-dialog persistent v-model="overlay">
            <v-row justify="center">
                <div class="col-10 col-md-6 col-sm-8 col-lg-6">
                    <v-progress-linear color="primary" indeterminate rounded height="10"></v-progress-linear>
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
                                    <div class="col-12 col-md-4 col-lg-4 col-sm-4">
                                        <v-select outlined :rules="valueRules" dense :items="departments"
                                            item-value="id" item-text="name" v-model="department_id" label="Department"
                                            hide-details single-line></v-select>
                                    </div>
                                    <div class="col-12 col-md-6 col-lg-6 col-sm-6">
                                        <v-text-field outlined :rules="valueRules" dense v-model="documentation_title"
                                            label="Document title" hide-details single-line></v-text-field>
                                    </div>
                                    <div class="col-12 col-md-2 col-lg-2 col-sm-2">
                                        <v-row>
                                            <div class="col-8">
                                                <v-btn color="primary" class="menu" elevation="0" block @click.stop=""
                                                    type="submit">Save</v-btn>
                                            </div>
                                            <div class="col-4">
                                                <v-btn @click="showdialog = true" icon elevation="0" outlined>
                                                    <v-icon>mdi-upload</v-icon>
                                                </v-btn>

                                            </div>


                                        </v-row>
                                    </div>
                                </v-row>
                                <v-row>
                                    <v-chip close @click:close="removeFile(index)"
                                        v-for="(file, index) in file_attachments" :key="index">{{ file.title }}</v-chip>
                                </v-row>
                            </v-card-text>
                        </v-card>
                        <div class="document-container">

                            <v-card-text v-for="(doc, docindex) in documentation.content" :key="docindex">
                                <div class="col-12" align="right" v-if="docindex > 0">
                                    <v-btn text color="error" class="menu" elevation="0"
                                        @click="removeMainSection(docindex)">Remove</v-btn>
                                </div>

                                <editor api-key="7huqtk7r95ignuh0b10vl6apfu1pe3n2bdbog1ofuzrwvbop"
                                    v-model="doc.contents" :rules="valueRules" :init="tinymnc" />

                                <div class="section-container mt-3 ml-10" v-for="(sect, index) in doc.sections"
                                    :key="index">
                                    <v-card-text>
                                        <v-row class="col-12">
                                            <div class="col-12 col-md-4 col-lg-4">
                                                <p>Document Section {{ index + 1 }}</p>
                                            </div>
                                            <div class="col-12 col-md-7 col-lg-7">
                                                <v-text-field outlined :rules="valueRules" v-model="sect.title"
                                                    @keyup="cacheData" dense label="Section title"></v-text-field>
                                            </div>
                                            <div class="col-12 col-md-1 col-lg-1">
                                                <v-btn text color="error" elevation="0" class="menu"
                                                    @click="removeSection(index)">Remove</v-btn>
                                            </div>
                                        </v-row>
                                        <editor api-key="7huqtk7r95ignuh0b10vl6apfu1pe3n2bdbog1ofuzrwvbop"
                                            v-model="sect.contents" :rules="valueRules" :init="tinymnc" />

                                        <div class="sub-section-container mt-3 ml-10"
                                            v-for="(subsect, i) in sect.sub_section" :key="i">
                                            <v-card-text>
                                                <v-row class="col-12">
                                                    <div class="col-12 col-md-4 col-lg-4">
                                                        <p>Sub Section {{ i + 1 }}</p>
                                                    </div>
                                                    <div class="col-12 col-md-7 col-lg-7">
                                                        <v-text-field outlined :rules="valueRules" @keyup="cacheData"
                                                            v-model="subsect.title" dense label="Sub Section title">
                                                        </v-text-field>
                                                    </div>
                                                    <div class="col-12 col-md-1 col-lg-1">
                                                        <v-btn text color="error" class="menu" elevation="0"
                                                            @click="removeSubSection(docindex, index, i)">Remove</v-btn>
                                                    </div>
                                                </v-row>
                                                <editor api-key="7huqtk7r95ignuh0b10vl6apfu1pe3n2bdbog1ofuzrwvbop"
                                                    v-model="subsect.contents" :rules="valueRules" :init="tinymnc" />
                                            </v-card-text>
                                        </div>
                                        <v-row class="mt-3">
                                            <v-spacer></v-spacer>
                                            <v-btn text class="menu" elevation="0" color="purple"
                                                @click="addSubSection(docindex, index)">Add sub sub section</v-btn>
                                        </v-row>
                                    </v-card-text>
                                </div>
                                <v-row justify="center" class="mt-3 mb-4">
                                    <v-btn text color="purple" class="menu" elevation="0" @click="addSection(docindex)">
                                        Add sub section</v-btn>
                                </v-row>
                                <div class="text-center">
                                    <v-snackbar v-model="snackbar" :timeout="timeout" dark top elevation="8"
                                        color="error">
                                        {{ snacktext }}
                                        <template v-slot:action="{ attrs }">
                                            <v-btn dark icon v-bind="attrs" @click="snackbar = false">
                                                <v-icon>mdi-close</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-snackbar>
                                </div>
                                <v-row justify="start" class="mt-3 mb-4 ml-3">
                                    <v-btn text class="menu" color="purple" elevation="0" @click="addMainSection">Add
                                        main section</v-btn>
                                </v-row>
                            </v-card-text>
                        </div>
                    </v-form>
                </v-col>
                <center v-else class="other-pannel">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </center>
            </div>
            <div class="col-12 col-md-6 col-lg-6 search-panel">
                <v-card-text>
                    <v-text-field light solo v-model="search" dense placeholder="Search document"
                        append-icon="mdi-magnify" hide-details="" style="
              border-bottom-left-radius: 0px;
              border-bottom-right-radius: 0px;
            " @keyup="searchDocument"></v-text-field>
                    <v-card tile v-show="searched.length > 0" elevation="1">
                        <v-btn class="menu" @click="showItem(doc)" v-for="(doc, index) in searched" :key="index" text
                            block tile>{{ doc.name }} <v-spacer></v-spacer>
                        </v-btn>
                    </v-card>
                </v-card-text>
            </div>
            <v-dialog :max-width="maxwidth" v-model="showdialog">
                <v-card>
                    <v-card-title>
                        Upload file <v-spacer></v-spacer>
                        <v-btn icon elevation="0" @click="showdialog = false" outlined>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field outlined :rules="valueRules" dense v-model="file_title" label="File title"
                            single-line></v-text-field>
                        <v-file-input prepend-icon="" prepend-inner-icon="mdi-attachment" v-model="file_upload"
                            @input="showdialog = false" dense outlined label="Upload file">

                        </v-file-input>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="file_upload == null" elevation="0" @click="attachFile()" color="primary">Add
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<script>
var timeIntervalID;

import Editor from "@tinymce/tinymce-vue";

export default {
    components: {
        editor: Editor,
    },
    data: () => ({
        nav_model: null,
        username: window.username,
        file_upload: null,
        file_title: "My file",
        showdialog: false,
        maxwidth: "50%",
        tinymnc: {
            images_upload_url: "postAcceptor.php",
            automatic_uploads: false,
            height: 500,
            menubar: false,
            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
            ],
            toolbar:
                "undo redo | formatselect | bold italic underline backcolor | \
           alignleft aligncenter alignright alignjustify | image bullist numlist outdent indent table | removeformat code | help",
        },
        file_attachments: [],
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
        logOut() {
            let url = window.api_url + "logout";

            this.overlay = true;

            this.$axios
                .post(url)
                .then((response) => {
                    if (response.data.success) {
                        localStorage.removeItem("token");
                        localStorage.removeItem("name");
                        localStorage.removeItem("dept_id");

                        window.location.href = "/";
                    }

                })
                .catch(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("name");
                    localStorage.removeItem("dept_id");
                    window.location.href = "/";
                    this.overlay = false;
                });
        },
        attachFile() {
            this.file_attachments = [];
            let file = { title: this.file_title, file: this.file_upload }
            this.file_attachments.push(file);
            this.showdialog = false;

        },
        removeFile(index) {
            this.file_attachments.splice(index, 1);

            this.file_upload = null;
            this.file_title = 'My file';
        },
        showItem(item) {
            if (item) {
                if (item.doc_index >= 0) {
                    this.documentation_title = item.name;
                    if (item.content != null && item.content.length == 0) {
                        item.content = [{
                            content: null,
                            sections: [],
                        }];
                        this.documentation = item;
                    }
                    else {
                        this.documentation = item;
                    }
                    this.file_attachments = item.files;

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

                }).finally(() => {
                    this.isLoading = false;
                });
        },
        saveDocument() {
            this.isLoading = true;
            let url = window.api_url + "update-documentation";
            let formdata = new FormData();

            formdata.append('document', JSON.stringify(this.documentation));
            formdata.append('dept_id', this.department_id);
            formdata.append('title', this.documentation_title);
            formdata.append('id', this.documentation.id);
            formdata.append('file_title', this.file_title);
            formdata.append('file', this.file_upload);

            this.$axios
                .post(url, formdata)
                .then((response) => {
                    if (response.data.success) {

                        window.location.reload();
                    }
                })
                .catch(() => {
                    this.isLoading = false;

                    this.documentation = null;
                    this.documentation_title = null;
                });
        },
    },

    destroyed() {
        clearInterval(timeIntervalID);

    },
    created() {
        this.getDocuments();

        this.documentation = [
            {
                content: null,
                sections: [],
            },
        ]



        this.getDepartiments();
    },
};
export class UploadAdapter {
    constructor(loader) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    var myReader = new FileReader();
                    myReader.onloadend = () => {
                        resolve({ default: myReader.result });
                    };

                    myReader.readAsDataURL(file);

                    console.log(reject);
                })
        );
    }

    // Aborts the upload process.
    abort() {
        //
    }
}

export const uploader = function (editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
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
