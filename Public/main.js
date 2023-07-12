let ydata = []
document.getElementById('queryForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerHTML = '';

  const query = document.getElementById('queryInput').value;
  const lambda = (document.getElementById('lambdaInput').value);
  const metadataFilter = document.getElementById('frequencyFilter').value;


  const loaderElement = document.createElement('div');
  loaderElement.classList.add('loader');
  loaderElement.textContent = ' Loading...';
  responseContainer.appendChild(loaderElement);

  axios.post('/query', { query, lambda, metadataFilter })
    .then(function(response) {
      displayResponse(response.data);
      displayResponseAsCards(response.data);
      displayResponseAsJSON(response.data);

      ydata = response.data
      viewSwitch.style.display = 'block';
    })
    .catch(function(error) {
      console.log(error);
      displayError(error.message || "Server Error");
    });
});

function displayResponse(data) {
  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerHTML = '';

  if (data && data.responseSet && data.responseSet.length > 0) {
    const response = data.responseSet[0].response;

    const metadata = response.filter(item => item.metadata.length > 0).map(item => item.metadata.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {}));

    const dataTable = createTable()

    if (dataTable) {
      response.forEach((item, index) => {
          const row = dataTable.insertRow(index + 1);
          const textCell = row.insertCell(0);
          const scoreCell = row.insertCell(1);
          const categoryArNameCell = row.insertCell(2);
          const categoryEnNameCell = row.insertCell(3);
          const reportArNameCell = row.insertCell(4);
          const reportEnNameCell = row.insertCell(5);
          const frequencyCell = row.insertCell(6);
          const indicatorEnNameCell = row.insertCell(7);

          textCell.innerHTML = item.text || '';
          scoreCell.innerHTML = item.score || '';
          categoryArNameCell.innerHTML = metadata[index].CATEGORY_AR_NAME || '';
          categoryEnNameCell.innerHTML = metadata[index].CATEGORY_EN_NAME || '';
          reportArNameCell.innerHTML = metadata[index].REPORT_AR_NAME || '';
          reportEnNameCell.innerHTML = metadata[index].REPORT_EN_NAME || '';
          frequencyCell.innerHTML = metadata[index].FREQUENCY || '';
          indicatorEnNameCell.innerHTML = metadata[index].INDICATOR_EN_NAME || '';
      });
  } else {
      console.error("Could not find the data table.");
  }
    
  } else {
    const noResultsElement = document.createElement('p');
    noResultsElement.classList.add('no-results');
    noResultsElement.textContent = 'No results found.';
    responseContainer.innerHTML = ''; // Clear the loader
    responseContainer.appendChild(noResultsElement);
  }
}

function createTable() {
// Create the table element
const dataTable = document.createElement('table');
dataTable.setAttribute('id', 'data-table');

// Create the table header row
const headerRow = document.createElement('tr');

// Define the table headers
const tableHeaders = [
    'Text',
    'Score',
    'CATEGORY_AR_NAME',
    'CATEGORY_EN_NAME',
    'REPORT_AR_NAME',
    'REPORT_EN_NAME',
    'FREQUENCY',
    'INDICATOR_EN_NAME'
];

// Create the table header cells
tableHeaders.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
});

// Append the header row to the table
dataTable.appendChild(headerRow);

// Append the table to the document body or any other desired container
const responseContainer = document.getElementById('responseContainer');
const container = document.createElement('div');
container.classList.add('table-container');
responseContainer.appendChild(container);
container.appendChild(dataTable);

return dataTable;
}

function createCardContainer() {
  const cardsContainer = document.createElement('div');
  cardsContainer.setAttribute('id', 'cardsContainer');
  cardsContainer.classList.add('cards-container');
  cardsContainer.style.display = 'none';

  // Append the table to the document body or any other desired container
const responseContainer = document.getElementById('responseContainer');
responseContainer.appendChild(cardsContainer);

return cardsContainer;
}

function displayError(errorMessage) {
  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerHTML = '';

  const errorElement = document.createElement('p');
  errorElement.classList.add('error');
  errorElement.textContent = `Error: ${errorMessage}`;

  responseContainer.appendChild(errorElement);
}

document.getElementById('darkModeToggle').addEventListener('change', function(event) {
  const body = document.body;
  body.classList.toggle('dark-mode');

  const header = document.querySelector('.header');
  header.classList.toggle('dark-mode');

  const main = document.querySelector('main');
  main.classList.toggle('dark-mode');

  const footer = document.querySelector('footer');
  footer.classList.toggle('dark-mode');

  const h1 = document.querySelector('h1');
  h1.classList.toggle('dark-mode');
});


function displayResponseAsJSON(data) {
  const jsonData = JSON.stringify(data, null, 2); 

  const responseContainer = document.getElementById('responseContainer');

  const jsonElement = document.createElement('pre');
  jsonElement.classList.add('json-container');
  jsonElement.setAttribute('id', 'jsonContainer');
  jsonElement.style.display = 'none';

  jsonElement.textContent = jsonData;
  responseContainer.appendChild(jsonElement);
}
  
function displayResponseAsCards(data) {

  createCardContainer();

  const cardsContainer = document.getElementById('cardsContainer');
  cardsContainer.innerHTML = '';

  if (data && data.responseSet && data.responseSet.length > 0) {
    const response = data.responseSet[0].response;

    const metadata = response.filter(item => item.metadata.length > 0).map(item => item.metadata.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.value }), {}));

    response.forEach((item, index) => {
      const card = document.createElement('div');
      card.classList.add('card');

      const textElement = document.createElement('p');
      textElement.innerHTML = '<strong>Text:</strong> ' + (item.text || '');
      card.appendChild(textElement);

      const scoreElement = document.createElement('p');
      scoreElement.innerHTML = '<strong>Score:</strong> ' + (item.score || '');
      card.appendChild(scoreElement);

      // Add more card content based on your table data

      cardsContainer.appendChild(card);
    });
  } else {
    const noResultsElement = document.createElement('p');
    noResultsElement.classList.add('no-results');
    noResultsElement.textContent = 'No results found.';
    cardsContainer.appendChild(noResultsElement);
  }
}

const tableViewButton = document.getElementById('tableViewButton');
const cardViewButton = document.getElementById('cardViewButton');
const jsonViewButton = document.getElementById('jsonViewButton');
const viewSwitch = document.getElementById('viewSwitch');

viewSwitch.style.display = 'none';



tableViewButton.addEventListener('click', function() {
  const tableView = document.getElementById('data-table');
const cardsContainer = document.getElementById('cardsContainer');
const jsonContainer = document.getElementById('jsonContainer');
  tableView.style.display = 'table';
  tableView.style.animation = 'fadeIn ease 1s';
  cardsContainer.style.display = 'none';
  jsonContainer.style.display = 'none';
  tableViewButton.classList.add('active');
  cardViewButton.classList.remove('active');
  jsonViewButton.classList.remove('active');
});

cardViewButton.addEventListener('click', function() {
  const tableView = document.getElementById('data-table');
const cardsContainer = document.getElementById('cardsContainer');
const jsonContainer = document.getElementById('jsonContainer');
  tableView.style.display = 'none';
  jsonContainer.style.display = 'none';
  cardsContainer.style.display = 'flex';
  cardsContainer.style.animation = 'fadeIn ease 1s';
  tableViewButton.classList.remove('active');
  jsonViewButton.classList.remove('active');
  cardViewButton.classList.add('active');
});

jsonViewButton.addEventListener('click', function() {
  const tableView = document.getElementById('data-table');
const cardsContainer = document.getElementById('cardsContainer');
const jsonContainer = document.getElementById('jsonContainer');
  tableView.style.display = 'none';
  jsonContainer.style.display = 'block';
  jsonContainer.style.animation = 'fadeIn ease 1s';
  cardsContainer.style.display = 'none';
  tableViewButton.classList.remove('active');
  cardViewButton.classList.remove('active');
  jsonViewButton.classList.add('active');
});

