'use strict'
let input = {
  value: '',
  ref: document.getElementById('floating-input'),
  get fiValue() {
    return this.value
  },
  set fiValue(val) {
    this.value = val
  }
}

// see script2 for working version

// leaving this file intact and comments in place

// so I tried but I was unable to work out the bug, I left console statements
// uncommented, you can see the behavior that is causing the issue.
// I tried several ways of getting rid of this behavior, the comments explain 
// most of it.

// my suggestion would be to ditch the floating input, I like the idea and its is some
// fancy dom work, but there are other ux issues with this approach.
// The biggest is a user has to press enter to change the cell data
// if they change the data but click on another cell the change is lost
// you can make the table cells editable.  When a user clicks the cell you can toggle
// an attribute of table data element.
// https://stackoverflow.com/questions/6012823/how-to-make-html-table-cell-editable


// I declared this in global scope for the sake of debugging, in production this should
// not be global
let allOfTheAddedTdElements = [];
const count = {
  selectElement: 0,
  handleReturn: 0,
};

// these also dont need to be in global, you could add them to the global state object
// or build one function that returns the element and pass the various ids to the function when used
const table1 = document.getElementById('table-1')
const thead1 = document.getElementById('thead-1')
const tbody1 = document.getElementById('tbody1')
const loadBtn = document.getElementById('load-btn')
const clearBtn = document.getElementById('clear-btn')
const fileName = document.getElementById('file-name')

const displayObject = function (items) {

  // make an array of elements
  // one issue with the dynamic html here is that it is tightly coupled to the data
  // in the future if a third weapon was added I would need to go here and change
  // the td. Or perhaps if the order in which the data is delivered changes there 
  // could be issues.  Mainly food for thought
  allOfTheAddedTdElements = items.map((item, index) => {
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
  // use the array to show the dynamic html
  allOfTheAddedTdElements.forEach(item => {
    let row = document.createElement('tr')
    tbody1.appendChild(row)
    row.innerHTML += item
  });
  // add event listeners to newly created elements, Im cheating and using classes
  // probably perfectly fine depending on who you talk to 
  const listOfElements = document.getElementsByClassName('character-data-js');
  // loop through the list of classes
  // i thought by adding the listener to the individual cell instead of the 
  // entire table would fix the issue but it hasn't. 
  // List of elements is not a standard array that you can call forEach on directly
  // it must be passed to array.from first
  Array.from(listOfElements).forEach(item => {
    item.addEventListener('click', (e) => { selectElement(e) })
  })
}



const getFile = function (e) {
  // console.log(e.target)
  // e.preventDefault()
  // fetch(`data/${fileName.value}.json`)
  //   .then(data => data.json())
  //   .then(data => displayObject(data))

  // i couldn't get the file download to work, probably a path issue on my end
  displayObject(mockData);
}

// i understand now why there was two events here, the first targets the floating input
// the second targets the td element.
const handleReturn = function (e, tableDataElement) {

  const idOfCellToChange = document.getElementById(tableDataElement);
  e.preventDefault()
  e.stopPropagation()
  if (event.keyCode === 13) {
    input.ref.style.display = 'none'
    input.ref.blur()
    input.ref.style.top = `0px`
    input.ref.style.left = `0px`

    // check out this behavior, you can see that this executes multiply times incrementally
    // based on table cell click events
    console.log(tableDataElement);
    console.log(count.handleReturn++);

    idOfCellToChange.innerHTML = input.ref.value
    input.value = input.ref.value
    // idOfCellToChange.removeEventListener('click', selectElement, true);
  }

  input.ref.removeEventListener('keyup', handleReturn, true)
}


const selectElement = function (e) {
  e.preventDefault()
  e.stopPropagation()

  // I thought by adding listeners to each cell it would prevent this from occurring 
  // more then once
  console.log('select element');
  console.log(count.selectElement++);

  const saveTableElementForLater = e.target.id;
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


  //  I understand why the two events were here now, I renamed the one for clarity
  // the fix is to move this outside of the click event
  input.ref.addEventListener('keyup', (e) => handleReturn(e, saveTableElementForLater), true)
}

// I wrapped this in a document listener, this is pretty standard practice
document.addEventListener('DOMContentLoaded', () => {
  loadBtn.addEventListener('click', getFile)
  clearBtn.addEventListener('click', function () { localStorage.clear(); location.reload(); })
});




const mockData = [
  { "name": "Rasdras Strongrage", "current_hp": "1", "temp_hp": "1", "max_hp": "1", "armor_class": "1", "initiative": "1", "weapon_1": "Mace", "weapon_2": "Longbow" },
  { "name": "Tharul Darkmaul", "current_hp": "2", "temp_hp": "2", "max_hp": "2", "armor_class": "2", "initiative": "2", "weapon_1": "Longsword", "weapon_2": "Battle Axe" },
  { "name": "Craurg Dreamlash", "current_hp": "3", "temp_hp": "3", "max_hp": "3", "armor_class": "3", "initiative": "3", "weapon_1": "Shortbow", "weapon_2": "Broadsword" },
  { "name": "Gaiku Frostwolf", "current_hp": "4", "temp_hp": "4", "max_hp": "4", "armor_class": "4", "initiative": "4", "weapon_1": "Longbow", "weapon_2": "Shortsword" },
  { "name": "Sathos Laughingseeker", "current_hp": "5", "temp_hp": "5", "max_hp": "5", "armor_class": "5", "initiative": "5", "weapon_1": "Quarterstaff", "weapon_2": "Dagger" }

]

