const searchBox = document.getElementById('search-box');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

let isUserActive = true;
let loadInterval = null;
let currentQuery = '';

// Имитация API
async function mockSearchAPI(query, delay = 500) {
  const mockResults = [
    { url: `https://example.com/${query}-1`, title: `Результат 1 по запросу "${query}"` },
    { url: `https://example.com/${query}-2`, title: `Результат 2 по запросу "${query}"` },
    { url: `https://example.com/${query}-3`, title: `Результат 3 по запросу "${query}"` },
  ];

  await new Promise(resolve => setTimeout(resolve, delay));
  return mockResults;
}

async function loadResults(query, isInitial = false) {
  if (!query.trim()) return;

  loadingDiv.style.display = 'block';
  const data = await mockSearchAPI(query, isInitial ? 300 : 1000);
  
  data.forEach(item => {
    const resultElement = document.createElement('div');
    resultElement.className = 'result';
    resultElement.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>`;
    
    resultElement.addEventListener('click', () => {
      isUserActive = false;
      clearInterval(loadInterval);
    });
    
    resultsDiv.appendChild(resultElement);
  });

  loadingDiv.style.display = 'none';
}

searchBox.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  if (query === currentQuery) return;

  currentQuery = query;
  resultsDiv.innerHTML = '';
  isUserActive = true;
  
  clearInterval(loadInterval);
  
  if (query) {
    loadResults(query, true);
    loadInterval = setInterval(() => {
      if (isUserActive) loadResults(query);
    }, 1500); // Подгрузка каждые 1.5 сек
  }
});
