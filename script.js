const accessKey = "38290660-b8879244287284787de681c49";
const searchForm = document.getElementById("search-form");
const input = document.querySelector('[type="text"]');
const resultsUl = document.querySelector("ul");

let pageNum = 1;
let keyword = "";

const getIndex = (item) => {
  const nodes = Array.prototype.slice.call(item.parentElement.children);
  return nodes.indexOf(item);
};

const obsCallback = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains('img--loaded')) {
        if(getIndex(entry.target) === resultsUl.children.length - 1) {
          observer.unobserve(entry.target);
          searchImages();
        }      
      }
    } 
  });
};

const observer = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0.1,
  rootMargin: '10px'
});

async function searchImages() {
  keyword = input.value;
  const url = `https://pixabay.com/api/?key=${accessKey}&q=${keyword}&page=${pageNum}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  pageNum++;
  
  const results = data.hits;
  
  results.map((result) => {
    const li = document. createElement("li");
    li.classList.add("img--loaded");
    const imageLink = document.createElement("a");
    imageLink.href = result.largeImageURL;
    const image = document.createElement("img");
    image.src = result.webformatURL;
    image.dataset.source = result.largeImageURL;
    image.alt = result.tags;
    li.appendChild(imageLink);
    imageLink.appendChild(image);  
    resultsUl.appendChild(li);
  });  
  document.querySelectorAll('.img--loaded').forEach((elem) => {
    observer.observe(elem);
  });
};
 
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchImages(); 
});
