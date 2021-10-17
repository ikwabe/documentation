
var departments = [
    { text: "Software Department", value: 1 },
    { text: "IT Department", value: 2 },
    { text: "SCM Department", value: 3 },
    { text: "CS Department", value: 4 },
];

var users = [
    { id: 1, name: "Shedrack Octavian", dept_id: 1 },
    { id: 2, name: "Joram Majage", dept_id: 2 },
    { id: 3, name: "Moses Kabungo", dept_id: 1 },
]

export default {

    async getDepartment() {
        return { data: departments }
    }
    ,
    async getUsers() {
        return { data: users }
    }
    ,
    async saveDocumentation(new_documentation) {
        let documentnumber = 1;
        if (window.localStorage.getItem("docnumber")) {

            documentnumber += Number(window.localStorage.getItem("docnumber"))

            window.localStorage.setItem(
                "docnumber",
                String(documentnumber)
            );

            window.localStorage.setItem(
                "documentation" + documentnumber,
                JSON.stringify(new_documentation)
            );

        }
        else {
            window.localStorage.setItem(
                "docnumber",
                String(documentnumber)
            );
            window.localStorage.setItem(
                "documentation" + documentnumber,
                JSON.stringify(new_documentation)
            );
        }

        return { message: "Documentation saved", data: JSON.parse(window.localStorage.getItem("documentation" + documentnumber)) }
    },

    async getDocumentations() {
        if (window.localStorage.getItem("docnumber")) {
            let docs = [];
            for (let i = 1; i <= Number(window.localStorage.getItem("docnumber")); i++)
                if (window.localStorage.getItem("documentation" + i)) {
                    docs.push(JSON.parse(window.localStorage.getItem("documentation" + i)))
                }
            return { message: "Documentation list", data: docs }

        }
    },

    async getDocumentationMenu() {
        let menu = [];
        if (window.localStorage.getItem("docnumber")) {
            
            for (let i = 1; i <= Number(window.localStorage.getItem("docnumber")); i++)
                if (window.localStorage.getItem("documentation" + i)) {
                    let deptname = departments.find(dept => dept.value == Number(JSON.parse(window.localStorage.getItem("documentation" + i)).department_id))
                    let findDept = menu.find(el => el.id == deptname.value);
                    if (findDept){
                        let child = menu[menu.indexOf(findDept)].children;
                        
                        if(child)
                        menu[menu.indexOf(findDept)].children.push({ doc_index:i-1, id: child.length+i, name: JSON.parse(window.localStorage.getItem("documentation" + i)).title })
                        else
                        menu[menu.indexOf(findDept)].children.push({ doc_index:i-1, id: i, name: JSON.parse(window.localStorage.getItem("documentation" + i)).title })
                    }
                    else {
                        menu.push({ id: deptname.value, name: deptname.text, children: [{doc_index:i-1, id: i, name: JSON.parse(window.localStorage.getItem("documentation" + i)).title }] })

                    }


                }

        }
        return { data: menu }
    }




}