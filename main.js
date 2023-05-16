const API = "http://localhost:8000/books";

// ? стягиваем лист
let list = document.querySelector(".list");

// ? стягиваем все Buttons
let btnAdd = document.querySelector("#add_btn");

let btnClose = document.querySelector(".btn-close");
let btnSave = document.querySelector(".btn-save");
let btnEdit = document.querySelector(".btn-edit");

// ? стягиваем модалтное окно
let mainModal = document.querySelector(".main-modal");

// ? стягиваем Inputs
let inpImage = document.querySelector("#image");
let inpTitle = document.querySelector("#input-title");
let inpAuthor = document.querySelector("#input-author");
let inpGenre = document.querySelector("#input-genre");
let inpDate = document.querySelector("#input-date");
let inpDescr = document.querySelector("#input-descr");

// ? глобальная область видимости для добавления
let editId = 0;

// ? search
let searchInp = document.querySelector("#search_input");
let searchVal = "";

btnAdd.addEventListener("click", function () {
  mainModal.style.display = "block";
  btnSave.style.display = "block";
  btnEdit.style.display = "none";
});

btnClose.addEventListener("click", function () {
  mainModal.style.display = "none";
  inpImage.value = "";
  inpTitle.value = "";
  inpAuthor.value = "";
  inpGenre.value = "";
  inpDate.value = "";
  inpDescr.value = "";
});

btnSave.addEventListener("click", async function () {
  let obj = {
    image: inpImage.value,
    title: inpTitle.value,
    author: inpAuthor.value,
    genre: inpGenre.value,
    date: inpDate.value,
    descr: inpDescr.value,
  };
  if (
    !obj.image.trim() ||
    !obj.title.trim() ||
    !obj.author.trim() ||
    !obj.genre.trim() ||
    !obj.date.trim() ||
    !obj.descr.trim()
  ) {
    alert("Заполните поля");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  inpImage.value = "";
  inpTitle.value = "";
  inpAuthor.value = "";
  inpGenre.value = "";
  inpDate.value = "";
  inpDescr.value = "";

  render();
});

// ! отображение Contact
async function render() {
  let books = await fetch(`${API}?q=${searchVal}`).then((res) => res.json());
  list.innerHTML = "";

  books.forEach((elem) => {
    let card = document.createElement("div");
    card.innerHTML = `
      <div class="card" style="width:225px" class="card-main">
     <img src="${elem.image}" alt="..." class="card-image" style="width: 100%">
      <p>Title: ${elem.title}</p>
      <p>Author: ${elem.author}</p>
      <p>Genre: ${elem.genre}</p>
      <p>Date: ${elem.date}</p>
      <p>Description: ${elem.descr}</p>
      <div class="btn-edit-delete">
      <button onclick="deleteCard(${elem.id} )" id="delete">DELETE</button>
      <button onclick="editCard(${elem.id})" id="edit">EDIT</button>
      </div>
      </div>`;
    list.append(card);
  });

  mainModal.style.display = "none";
}
render();

async function deleteCard(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
}
render();

async function editCard(id) {
  editId = id;
  mainModal.style.display = "block";
  btnSave.style.display = "none";
  btnEdit.style.display = "block";

  let res = await fetch(`${API}/${id}`);
  let data = await res.json();

  inpImage.value = data.image;
  inpTitle.value = data.title;
  inpAuthor.value = data.author;
  inpGenre.value = data.genre;
  inpDate.value = data.date;
  inpDescr.value = data.descr;
}

btnEdit.addEventListener("click", async () => {
  let obj = {
    image: inpImage.value,
    title: inpTitle.value,
    author: inpAuthor.value,
    genre: inpGenre.value,
    date: inpDate.value,
    descr: inpDescr.value,
  };

  await fetch(`${API}/${editId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  render();
});

searchInp.addEventListener("input", function () {
  searchVal = searchInp.value; // записывает значение поисковика в переменную searchVal
  // currentPage = 1;
  render();
});
