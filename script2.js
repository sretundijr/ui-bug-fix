let input = {
  // value: '',
  ref: document.getElementById('floating-input'),
  // get fiValue() {
  //   return this.value
  // },
  // set fiValue(val) {
  //   this.value = val
  // }
}

// this is the state management object I spoke of on fb. I load the starting data
// to this object and then pass the object around. In script.js we are actually 
// storing state in the dom, here we are storing state to the object
// now when I want to save to local storage i can use
// localStorage.setItem('saved game', state.data)
const state = {
  data: '',
  allOfTheAddedTdElements: [],
  saveTableElementForLater: '',
};


const count = {
  selectElement: 0,
  handleReturn: 0,
};

const table1 = document.getElementById('table-1')
const thead1 = document.getElementById('thead-1')
const tbody1 = document.getElementById('tbody1')
const loadBtn = document.getElementById('load-btn')
const clearBtn = document.getElementById('clear-btn')
const fileName = document.getElementById('file-name')
const submitBtn = document.getElementById('submit-input');


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

  const listOfElements = document.getElementsByClassName('character-data-js');
  Array.from(listOfElements).forEach(item => {
    item.addEventListener('click', (e) => { selectElement(e) })
  })
}

const getFile = function (e) {
  state.data = mockData;
  displayObject(state.data);
}

const handleReturn = function (e, tableDataElement) {
  // grab the index from the id attribute
  const index = tableDataElement.replace(/^\D+/g, '');
  // grab the object key portion from the id attr
  const objectKey = tableDataElement.replace(`-${index}`, '');

  e.preventDefault()
  e.stopPropagation()

  if (event.keyCode === 13) {
    input.ref.style.display = 'none'
    input.ref.blur()
    input.ref.style.top = `0px`
    input.ref.style.left = `0px`

    // assign the object by index and key 
    state.data[index][objectKey] = input.ref.value;

    // check my work
    console.log(state.data);

    // call render after the state object has changed
    displayObject(state.data);
  }

}


const selectElement = function (e) {
  e.preventDefault()
  e.stopPropagation()

  let left = e.x - e.offsetX
  let top = e.y - e.offsetY
  input.ref.style.display = 'inline-block'
  input.ref.style.top = `${top}px`
  input.ref.style.left = `${left}px`
  input.ref.focus()
  input.ref.value = e.target.innerHTML
  input.value = e.target.innerHTML
  input.ref.style.paddingLeft = '7px'
  input.ref.style.fontSize = '.95em'

  state.saveTableElementForLater = e.target.id;
}

// I wrapped this in a document listener, this is pretty standard practice
document.addEventListener('DOMContentLoaded', () => {
  loadBtn.addEventListener('click', getFile)

  // moving this outside of the edit event loop is what fixed the problem
  input.ref.addEventListener('keyup', (e) => handleReturn(e, state.saveTableElementForLater), true)

  clearBtn.addEventListener('click', function () { localStorage.clear(); location.reload(); })
});




const mockData = [
  { "name": "Rasdras Strongrage", "current_hp": "1", "temp_hp": "1", "max_hp": "1", "armor_class": "1", "initiative": "1", "weapon_1": "Mace", "weapon_2": "Longbow" },
  { "name": "Tharul Darkmaul", "current_hp": "2", "temp_hp": "2", "max_hp": "2", "armor_class": "2", "initiative": "2", "weapon_1": "Longsword", "weapon_2": "Battle Axe" },
  { "name": "Craurg Dreamlash", "current_hp": "3", "temp_hp": "3", "max_hp": "3", "armor_class": "3", "initiative": "3", "weapon_1": "Shortbow", "weapon_2": "Broadsword" },
  { "name": "Gaiku Frostwolf", "current_hp": "4", "temp_hp": "4", "max_hp": "4", "armor_class": "4", "initiative": "4", "weapon_1": "Longbow", "weapon_2": "Shortsword" },
  { "name": "Sathos Laughingseeker", "current_hp": "5", "temp_hp": "5", "max_hp": "5", "armor_class": "5", "initiative": "5", "weapon_1": "Quarterstaff", "weapon_2": "Dagger" }

]