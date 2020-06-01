function createModal() {
    let createModal = document.createElement('div');
    createModal.setAttribute('id', 'myModal');
    createModal.setAttribute('class', 'modal');
    let createModalInside = document.createElement('div');
    createModalInside.setAttribute('class', 'modal-content');
    createModal.appendChild(createModalInside);
    let createModalButtonClose = document.createElement('class');
    createModalButtonClose.setAttribute('class', 'closeModal');
    createModalButtonClose.innerHTML = 'Close';
    createModalInside.appendChild(createModalButtonClose);
    let createModalTable = document.createElement('table');
    createModalTable.setAttribute('class', 'tableOfModal');
    createModalInside.appendChild(createModalTable);
    let getBody = document.querySelector('body');
    getBody.appendChild(createModal);

}

function initData(url, index) {
    console.log(index)
    let actualUrl = url + index.toString();
    fetch(actualUrl)
        .then((response) => response.json())
        .then((data) => {
            deleteNotNeededData(data)
        })
}

function deleteNotNeededData(data) {
    for (let i in data.results) {
        delete data.results[i]["rotation_period"]
        delete data.results[i]["orbital_period"]
        delete data.results[i]["gravity"]
        delete data.results[i]["films"]
        delete data.results[i]["created"]
        delete data.results[i]["url"]
        delete data.results[i]["edited"]
    }
    generateTable(data)
}


function generateTable(data) {
    let getBody = document.getElementsByTagName('body')[0];
    let createTable = document.createElement('table');
    let endOfTableBody = document.createElement('tbody');
    const dataResultValues = Object.values(data.results[0]);
    console.log(dataResultValues);
    for (row in data.results) {
        let rowOfTable = document.createElement('tr');
        rowOfTable.setAttribute('id', 'row' + row);
        for (col in dataResultValues) {
            let colOfTable = document.createElement('td');
            colOfTable.setAttribute('id', 'cell' + col);
            rowOfTable.appendChild(colOfTable)
            const dataResultsPerRow = Object.values(data.results[row]);
            // Checking for resident cols
            if (col == 6) {
                // This happen if there is no data in dataResultsPerRow.
                if (dataResultsPerRow[col].length == 0) {
                    colOfTable.innerHTML = 'No known residents'
                }
                // Generates the links of residents and adds <a> tag and a button
                else {
                    let residentButton = document.createElement('button');
                    residentButton.setAttribute('class', 'buttons')
                    let residentLinks = document.createElement('a');
                    residentLinks.setAttribute('class', 'invisible');
                    residentButton.append(dataResultsPerRow[col].length);
                    colOfTable.appendChild(residentButton);
                    const dataOfResidentInRows = Object.values(data.results[row]['residents'])
                    let arrayLength = dataOfResidentInRows.length;
                    for (let i = 0; i < arrayLength; i++) {
                        residentLinks.append(dataOfResidentInRows[i]);
                        residentButton.appendChild(residentLinks);
                    }
                    putDataInModal(dataOfResidentInRows, residentButton)
                }
            } else {
                colOfTable.innerHTML = dataResultsPerRow[col].toString();
            }
        }
        endOfTableBody.appendChild(rowOfTable);
    }
    createTable.appendChild(endOfTableBody);
    getBody.appendChild(createTable);
}

function putDataInModal(dataOfResidentInRows, residentButton) {
    residentButton.addEventListener('click', function () {
        openModalPage();
        let headerList = ["name", "height", "mass", "skin color", "hair color", "eye color", "birth year", "gender"]
        let headerRow = document.createElement("tr")
        headerRow.setAttribute("class", "modalHead")
        let createTableOfModal = document.createElement("table");
        createTableOfModal.setAttribute('class', 'tableOfModal');
        let tableOfModal = document.querySelector('.tableOfModal')
        tableOfModal.appendChild(headerRow);
        for (let headerData of headerList) {
            let hdm = document.createElement("td");
            headerRow.appendChild(hdm);
            hdm.innerHTML = headerData;
        }
        for (let linkOfResidents of dataOfResidentInRows) {
            fetch(linkOfResidents)  // set the path; the method is GET by default, but can be modified with a second parameter
                .then((response) => response.json())  // parse JSON format into JS object
                .then((residentData) => {
                    let residentValuesOfResidentData = Object.values(residentData);
                    residentValuesOfResidentData = residentValuesOfResidentData.slice(0, 8);
                    let rowModal = document.createElement("tr")
                    rowModal.setAttribute("class", "modalTableProperties")
                    for (let residentValues of residentValuesOfResidentData) {
                        let td = document.createElement('td')
                        rowModal.appendChild(td)
                        let tableOfModal = document.querySelector(".tableOfModal");
                        tableOfModal.appendChild(rowModal)
                        td.innerHTML = residentValues;
                    }
                })
        }
    });
}

function openModalPage() {
    let modal = document.querySelector('.modal');
    modal.style.display = "block";
}

function closeModalPage() {
    let modal = document.querySelector('.modal');
    let closeButton = document.querySelector('.closeModal');
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        clearModal()
    })
}

function clearModal() {
    let modal = document.querySelector(".modal");
    modal.remove()
    createModal()
}

function getNextPage(index) {
    document.querySelector('#nextPage').addEventListener('click', function () {
        if (index < 6) {
            initData('https://swapi.dev/api/planets/?page=', ++index);
        }
    })
}

function getPreviousPage(index) {
    document.querySelector('#back').addEventListener('click', function () {
        if (index > 1) {
            initData('https://swapi.dev/api/planets/?page=', --index);
        }
    })
}

function init() {
    let index = 1;
    createModal()
    initData('https://swapi.dev/api/planets/?page=', index)
    getNextPage(index)
    getPreviousPage(index)
    closeModalPage()
}

init()