//console.log('kire sob thikache to?')
//Create loadCategories
const loadCategories = () => {
  //Fetch Data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log("error msg:", error));
};
//create DisplayCategories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  //create buttonton
  categories.forEach((item) => {
    console.log(item);
    const button = document.createElement("button");
    button.classList='btn'
    button.innerText = item.category;

    //add button to category Container
    categoryContainer.appendChild(button);
  });
};
loadCategories();
