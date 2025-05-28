//console.log('kire sob thikache to?')
function getTimeString(time) {
  let hour = parseInt(time / 3600);
  let min = parseInt((time % 3600) / 60);
  let sec = parseInt((time % 3600) % 60);

  return `${hour} hour ${min} min ${sec} sec ago`;
}

const removeActiveClass = () => {
  const btnCatcher = document.getElementsByClassName("category-btn");
  for (let btn of btnCatcher) {
    btn.classList.remove("active");
  }
};

const allVideosShow = () => {
  document.getElementById("all").addEventListener("click", async () => {
    removeActiveClass();
    document.getElementById("all").classList.add("active");
    const url = `https://openapi.programming-hero.com/api/phero-tube/videos`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      displayVideos(data.videos);
    } catch (error) {
      console.log("Error: ", error);
    }
  });
};

//Create loadCategories
const loadCategories = () => {
  //Fetch Data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log("error msg:", error));
};
// Load video Details Button
const loadVideoDetails = async (videoId) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(url);
  const data = await res.json();
  displayDetails(data.video);
};

const displayDetails = (video) => {
  const modalContent = document.getElementById("modal-content");
  modalContent.innerHTML = `
    <img src="${video.thumbnail}">
    <p>${video.description}</p>
    `;

  //way-1
  // document.getElementById('showModalData').click();

  //way-2
  document.getElementById("customModal").showModal();
};
//Create videoCategories
const loadVideos = (searchText = "") => {
  //Fetch Data
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log("error msg:", error));
};

//load Category Videos
const loadCategoryVideos = (id) => {
  // alert(id);
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.log("error msg:", error));
};

//Display Videos
const displayVideos = (videos) => {
  // console.log(videos);
  window.currentVideos = videos;

  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";
  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
    <div class="min-h-[300px] flex flex-col justify-center items-center gap-5">
    <img src="icon.png">
    <h2 class="text-center text-xl font-bold">No Content Here in this category.</h2>
    </div>`;
    return;
  }
  videos.forEach((video) => {
    // console.log(video);
    const card = document.createElement("div");
    card.classList = "card bg-base-100 shadow-sm";
    card.innerHTML = `
        <figure class="h-[200px] relative">
    <img
      src=${video.thumbnail}
      class="w-full h-full object-cover"
      alt="Shoes" />
      ${
        video.others.posted_date?.length == 0
          ? ""
          : `<span class="absolute bottom-2 right-2 text-xs bg-black rounded text-white p-1">${getTimeString(
              video.others.posted_date
            )}</span>`
      }
      
  </figure>
  <div class="px-0 py-2 flex gap-5">
    <div class="">
      <img class="w-10 h-10 rounded-full object-cover" src=${
        video.authors[0].profile_picture
      } alt="" />
    </div>
    <div>
      <h2 class="font-bold">${video.title}</h2>
      <div class="flex items-center gap-2">
        <p class="text-gray-400">${video.authors[0].profile_name}</p>
        ${
          video.authors[0].verified === true
            ? `<img class="w-5" src="https://img.icons8.com/?size=96&id=102561&format=png" alt="">`
            : ""
        }
        
      </div>
      <p><button onclick="loadVideoDetails('${
        video.video_id
      }')" class="btn btn-sm btn-error">Details</button></p>
    </div>

  </div>
        `;
    videoContainer.append(card);
  });
};
//DisplayCategories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  //create button
  categories.forEach((item) => {
    // console.log(item);
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
    ${item.category}
    </button>
    `;

    //add button to category Container
    categoryContainer.appendChild(buttonContainer);
  });
};

document.getElementById("search-input").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
});

//Sorting Option added
document.getElementById("sort-select").addEventListener("change", (e) => {
  const option = e.target.value;
  let videos = [...window.currentVideos];

  if (option === "views") {
    videos.sort((a, b) => {
      const viewA = parseInt(a.others.views.replace("K", "000")) || 0;
      const viewB = parseInt(b.others.views.replace("K", "000")) || 0;
      return viewB - viewA;
    });
  } else if (option === "title") {
    videos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (option === "date") {
    videos.sort((a, b) => (b.others.posted_date || 0) - (a.others.posted_date || 0));
  }

  displayVideos(videos);
});



allVideosShow();
loadCategories();
loadVideos();
