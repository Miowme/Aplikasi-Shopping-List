const itemInput = document.getElementById("itemInput");
const addButton = document.getElementById("addButton");
const shoppingList = document.getElementById("shoppingList");
const emptyRow = document.getElementById("emptyRow");

let items = JSON.parse(localStorage.getItem("shoppingListItems")) || [];

let editIndex = -1;

renderList();

function renderList() {
  shoppingList
    .querySelectorAll("tr:not(#emptyRow)")
    .forEach((row) => row.remove());

  if (items.length === 0) {
    emptyRow.style.display = "";
  } else {
    emptyRow.style.display = "none";

    items.forEach((itemText, index) => {
      const tr = document.createElement("tr");

      if (index === editIndex) {
        tr.innerHTML = `
          <td class="col-no">${index + 1}</td>
          <td>
            <input type="text" class="edit-input" id="inputEdit-${index}" value="${itemText}">
          </td>
          <td class="col-action">
            <button class="btn-save" onclick="saveItem(${index})">Save</button>
            <button class="btn-delete" onclick="cancelEdit()">Batal</button>
          </td>
        `;
      } else {
        tr.innerHTML = `
          <td class="col-no">${index + 1}</td>
          <td>${itemText}</td>
          <td class="col-action">
            <button class="btn-edit" onclick="enableEdit(${index})">Edit</button>
            <button class="btn-delete" onclick="deleteItem(${index})">Delete</button>
          </td>
        `;
      }

      shoppingList.appendChild(tr);
    });
  }
}

function addItem() {
  const itemText = itemInput.value.trim();

  if (itemText === "") {
    alert("Silakan ketik nama item terlebih dahulu!");
    return;
  }

  items.push(itemText);
  saveToLocalStorage();
  renderList();

  itemInput.value = "";
  itemInput.focus();
}

function enableEdit(index) {
  editIndex = index;
  renderList();

  const editInput = document.getElementById(`inputEdit-${index}`);
  if (editInput) {
    editInput.focus();
    editInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        saveItem(index);
      }
    });
  }
}

function saveItem(index) {
  const editInput = document.getElementById(`inputEdit-${index}`);
  const updatedText = editInput.value.trim();

  if (updatedText === "") {
    alert("Nama item tidak boleh kosong!");
    return;
  }

  items[index] = updatedText;
  editIndex = -1;
  saveToLocalStorage();
  renderList();
}

function cancelEdit() {
  editIndex = -1;
  renderList();
}

function deleteItem(index) {
  items.splice(index, 1);

  if (editIndex === index) {
    editIndex = -1;
  }

  saveToLocalStorage();
  renderList();
}

function saveToLocalStorage() {
  localStorage.setItem("shoppingListItems", JSON.stringify(items));
}

addButton.addEventListener("click", addItem);
itemInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addItem();
  }
});
