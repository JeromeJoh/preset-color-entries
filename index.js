import { colorList, paletteList, artworkList } from "./data.js"

const _gridRow = 13
const _gridCol = 13

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

  for (let i = 0; i < _gridRow * _gridCol; i++) {
    const grid = document.createElement('div')
    if (i < colorList.length) grid.style.setProperty('--color', colorList[i].colorName.toLowerCase())
    fragS.appendChild(grid)
  }

  section.appendChild(fragS)
}

const bindEvents = () => {
  const panels = gsap.utils.toArray('ul')
  const menu = document.querySelector('menu')
  const board = document.querySelector('main section')
  const grids = gsap.utils.toArray('main section div')
  const mark = document.querySelector('mark')

  board.addEventListener('click', async (e) => {
    const el = e.target
    if (!el.matches('div')) return
    const color = el.style.getPropertyValue('--color')
    try {
      await navigator.clipboard.writeText(color)
      mark.dataset.toast = ' copied'
      setTimeout(() => mark.dataset.toast = '', 1000)
    } catch (err) {
      console.log('Fail to copy current color name: ', color)
    }
  })

  menu.addEventListener('click', (e) => {
    const target = e.target;
    if (!target.matches('button')) return
    console.log(target.innerText)

    const { innerText } = target

    switch (innerText.slice(2, innerText.length - 2)) {
      case 'OVERVIEW':
        resetGrids()
        setGridColor(colorList)
        gsap.to(letterController[0], { x: 0, opacity: 1 })
        gsap.to(letterController[1], { x: 0, opacity: 1 })
        break
      case 'PALETTE':
        resetGrids()
        setGridColor(paletteList)
        gsap.to(letterController[0], { x: -100, opacity: 0 })
        gsap.to(letterController[1], { x: 100, opacity: 0 })
        break
      case 'ARTWORK':
        resetGrids()
        setGridColor(artworkList)
        gsap.to(letterController[0], { x: -100, opacity: 0 })
        gsap.to(letterController[1], { x: 100, opacity: 0 })
        break
      default:
        break
    }
  })

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

      const filteredColorList = colorList.filter((color) => color.colorName.startsWith(target.innerText)
      )
      resetGrids()
      setGridColor(filteredColorList)
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
}

const letterController = gsap.utils.toArray('aside')
const asideTween = gsap.timeline({
  paused: true,
  defaults: {
    duration: 0.5,
    ease: 'power2.inOut',
  },
})

asideTween
  .from(letterController[0], {
    x: -100,
    opacity: 0,
  }).from(letterController[1], {
    x: 100,
    opacity: 0,
  }, "<")

window.addEventListener('DOMContentLoaded', () => {
  init()
  bindEvents()
  setGridColor(colorList)
  asideTween.play()
})