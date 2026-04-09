const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('cat');

// Mapping for JSON files
const dataFiles = {
    'DDL': 'ddl.json',
    'DML': 'dml.json',
    'DQL': 'dql.json',
    'WHERE': 'where_order.json',
    "LIKE": "like.json",
    "GROUP_BY": "group_by.json",
    "SUBQUERIES": "subqueries.json",
    "SCALAR": "scalar.json",
    "JOINS": "joins.json",
    "SET": "set.json",
    "VIEWS": "views.json",
    "DECISION": "decision.json",
    "ITERATIVE": "iterative.json",
    "DATA_RETRIEVAL": "data_retrieval.json",
    'PLSQL_BASICS': 'plsql_basics.json'
};

const problemList = document.getElementById('problemList');
const problemQuestion = document.getElementById('problemQuestion');
const queryDisplay = document.getElementById('queryDisplay');
const outputDisplay = document.getElementById('outputDisplay');
const welcomeMsg = document.getElementById('welcomeMsg');
const contentBox = document.getElementById('contentBox');
const catTitle = document.getElementById('catTitle');

let loadedQuestions = [];

async function loadData() {
    if (!category || !dataFiles[category]) return;

    catTitle.innerText = `${category} Problems`;

    try {
        const response = await fetch(`data/${dataFiles[category]}`);
        loadedQuestions = await response.json();
        
       
       problemList.innerHTML = '';
        let lastGroup = ""; 

       loadedQuestions.forEach((prob, index) => {
            // Smart Check: Agar JSON mein 'group' hai, tabhi heading dikhao
            if (prob.group && prob.group !== lastGroup) {
                const groupHeader = document.createElement('div');
                groupHeader.className = 'group-header';
                groupHeader.innerText = `→ ${prob.group.split('(')[0].trim()}`;
                problemList.appendChild(groupHeader);
                lastGroup = prob.group;
            }

            // Problem item (Hamesha dikhega)
            const li = document.createElement('li');
            li.className = 'sub-problem';
            li.innerText = `Problem ${index + 1}`; 
            li.onclick = () => showProblem(index);
            problemList.appendChild(li);
        });

        // Top bar Title Update
        catTitle.innerText = `${category} Problems - ${loadedQuestions.length}`;

        // Category Title update (Top par count dikhane ke liye)
        catTitle.innerText = `${category} Problems - ${loadedQuestions.length}`;

    } catch (error) {
        console.error("Data load error:", error);
    }
}

function showProblem(index) {
    const data = loadedQuestions[index];
    welcomeMsg.style.display = 'none';
    contentBox.style.display = 'block';

    problemQuestion.innerText = data.question;
    queryDisplay.innerText = data.query;

    // Table format mein output dikhane ke liye
    if (data.output_table) {
        let tableHTML = `<table class="oracle-table"><thead><tr>`;
        // Headers banayein
        Object.keys(data.output_table[0]).forEach(key => {
            tableHTML += `<th>${key.toUpperCase()}</th>`;
        });
        tableHTML += `</tr></thead><tbody>`;
        // Data rows banayein
        data.output_table.forEach(row => {
            tableHTML += `<tr>`;
            Object.values(row).forEach(val => {
                tableHTML += `<td>${val === null ? '<i>(null)</i>' : val}</td>`;
            });
            tableHTML += `</tr>`;
        });
        tableHTML += `</tbody></table>`;
        outputDisplay.innerHTML = tableHTML;
    } else {
        outputDisplay.innerText = data.output;
    }
}

loadData();