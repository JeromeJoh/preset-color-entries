import { colorList } from "./data.js"

const _gridSize = 13
const excludedLetters = ['E', 'J', 'Q', 'U', 'X', 'Z']


const init = () => {
  const panelL = document.querySelector('.panel-left ul')
  const panelR = document.querySelector('.panel-right ul')

  const fragL = document.createDocumentFragment()
  const fragR = document.createDocumentFragment()

  let adder = 0

  for (let i = 0; i < 10; i++) {
    if (excludedLetters.includes(String.fromCharCode(65 + i + adder))) adder++
    const li = document.createElement('li')
    li.innerText = String.fromCharCode(65 + i + adder)
    li.style.setProperty('--sibling-index', i + 1)
    fragL.appendChild(li)
    if (i === 9) adder = 0
  }

  for (let i = 0; i < 10; i++) {
    if (excludedLetters.includes(String.fromCharCode(77 + i + adder))) adder++
    const li = document.createElement('li')
    const span = document.createElement('span')
    span.innerText = String.fromCharCode(77 + i + adder)
    li.style.setProperty('--sibling-index', i + 1)
    li.appendChild(span)
    fragR.appendChild(li)
    if (i === 9) adder = 0
  }

  panelL.appendChild(fragL)
  panelR.appendChild(fragR)

  const section = document.querySelector('main section')
  const fragS = document.createDocumentFragment()

  for (let i = 0; i < colorList.length; i++) {
    const grid = document.createElement('div')
    grid.style.setProperty('--color', colorList[i].colorName.toLowerCase())
    fragS.appendChild(grid)
  }

  section.appendChild(fragS)
}

const bindEvents = () => {
  const panels = gsap.utils.toArray('ul')
  const menu = document.querySelector('menu')
  const grids = gsap.utils.toArray('main section div')
  const mark = document.querySelector('mark')

  document.querySelector('section').addEventListener('mouseleave', () => { mark.innerText = "#" })

  grids.forEach((grid) => {
    grid.addEventListener('mouseenter', (e) => {
      const target = e.target;
      if (!target.matches('div')) return

      mark.innerText = target.style.getPropertyValue('--color') === "transparent" ? "#" : target.style.getPropertyValue('--color')
    })
  })

  panels.forEach((panel) => {
    panel.addEventListener('click', (e) => {
      const target = e.target;
      if (!target.matches('li') && !target.matches('span')) return

      const filterColorList = colorList.filter((color) => color.colorName.startsWith(target.innerText)
      )
      resetGrids()
      setGridColor(filterColorList)
      gsap.from(grids, {
        scale: 0,
        duration: 0.5,
        stagger: {
          amount: 0.5,
          from: 'start',
          grid: 'auto',
          each: 0.1,
        },
      })
    })
  })
}

const resetGrids = () => {
  const grids = gsap.utils.toArray('main section div')
  grids.forEach((grid) => {
    grid.style.setProperty('--color', "transparent")
  })
}

const setGridColor = (colorList) => {
  const grids = gsap.utils.toArray('main section div')
  colorList.forEach((color, index) => {
    grids[index].style.setProperty('--color', color.colorName.toLowerCase())
  })
}

window.addEventListener('DOMContentLoaded', () => {
  init()
  bindEvents()

  const grids = gsap.utils.toArray('main section div')

  gsap.from(grids, {
    scale: 0,
    duration: 0.5,
    stagger: {
      amount: 0.5,
      from: 'start',
      grid: 'auto',
      each: 0.1,
    },
  })
})