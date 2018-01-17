'use strict';

const state = {
  data: '',
  allOfTheAddedTdElements: [],
  saveTableElementForLater: '',
};

const table1 = document.getElementById('table-1');
const thead1 = document.getElementById('thead-1');
const tbody1 = document.getElementById('tbody1');
const loadBtn = document.getElementById('load-btn');
const clearBtn = document.getElementById('clear-btn');
const fileName = document.getElementById('file-name');
const submitBtn = document.getElementById('submit-input');
const input = document.getElementById('floating-input');

const displayObject = function (items) {

  // clear old before re-render this should remove old event handlers
  tbody1.innerHTML = '';

  state.allOfTheAddedTdElements = items.map((item, index) => {
    return `
      <td class="character-data-js" id="name-${index}">${item.name}</td>
      <td  class="character-data-js" id="current_hp-${index}">${item.current_hp}</td>
      <td  class="character-data-js" id="temp_hp-${index}">${item.temp_hp}</td>
      <td  class="character-data-js" id="max_hp-${index}">${item.max_hp}</td>
      <td  class="character-data-js" id="armor_class-${index}">${item.armor_class}</td>
      <td  class="character-data-js" id="initiative-${index}">${item.initiative}</td>
      <td  class="character-data-js" id="weapon_1-${index}">${item.weapon_1}</td>
      <td  class="character-data-js" id="weapon_2-${index}">${item.weapon_2}</td>
      `
  })

  state.allOfTheAddedTdElements.forEach(item => {
    let row = document.createElement('tr')
    tbody1.appendChild(row)
    row.innerHTML += item
  });
}

const getFile = function (e) {
    e.preventDefault()
  fetch(`data/${fileName.value}.json`)
    .then(data => data.json())
    .then((data) => state.data = data)
    .then(data => displayObject(data))
      
};

const handleReturn = function (e, tableDataElement) {
  // grab the index from the id attribute
  const index = tableDataElement.substring(tableDataElement.indexOf('-') + 1);

  // grab the object key portion from the id attr
  const objectKey = tableDataElement.replace(`-${index}`, '');
  e.preventDefault()

  if (event.keyCode === 13) {
    input.style.display = 'none';
    input.blur();
    input.style.top = `0px`;
    input.style.left = `0px`;

    // assign the object by index and key 
    state.data[index][objectKey] = input.value;

    // check my work
    console.log(state.data);

    // call render after the state object has changed
    displayObject(state.data);
    localStorage.setItem(`${fileName.value}`, JSON.stringify(state.data));
  }

};

const selectElement = function (e) {
  e.preventDefault();
  let  fieldLength = e.target.innerHTML;
  let length = fieldLength.length * 10;
  let left = e.x - e.offsetX;
  let top = e.y - e.offsetY;
  input.style.width = `${length}px`;
  input.style.display = 'inline-block';
  input.style.top = `${top}px`;
  input.style.left = `${left}px`;
  input.focus();
  input.value = e.target.innerHTML;
  input.style.paddingLeft = '7px';
  input.style.fontSize = '.95em';
  state.saveTableElementForLater = e.target.id;
}

document.addEventListener('DOMContentLoaded', () => {
  loadBtn.addEventListener('click', getFile);
  input.addEventListener('keyup', (e) => handleReturn(e, state.saveTableElementForLater));
  clearBtn.addEventListener('click', function () { localStorage.clear(); location.reload(); })
  table1.addEventListener('click', (e) => { selectElement(e) });
});


