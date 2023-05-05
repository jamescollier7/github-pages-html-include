(()=>{
  'use strict';
  
  const includeElements = document.querySelectorAll(`[data-include]`)
  const groupedIncludeMap = groupIncludeElementsIntoMap(includeElements)
  
  groupedIncludeMap.forEach(processGroupOfIncludes)
  
  /*
    Reduce a set of elements with paths to a Map of paths with 
    an array of those elements -- e.g.
      <div id="1" data-include="hi.html"></div>
      <div id="2" data-include="hi.html"></div>
      <div id="3" data-include="hey.html"></div>
      
      turns into
      
      {
        'hi.html': ['<div id="1">' , '<div id="2">'],
        'hey.html': ['<div id="3">']
      }
  */
  function groupIncludeElementsIntoMap(includeElements) {
    const arrayOfIncludeElements = Array.from(includeElements)
    return arrayOfIncludeElements.reduce((accumulatorMap, includeElement) => {
      const path = includeElement.getAttribute(`data-include`)
      let arrayOfElements = accumulatorMap.get(path)

      if (!arrayOfElements) {
        arrayOfElements = []
      }

      arrayOfElements.push(includeElement)

      accumulatorMap.set(path, arrayOfElements)
      
      return accumulatorMap
    }, new Map())
  }
  
  /*
    Use the path of a group, fetch the data using that path, 
    and inject the result into each of the elements in the group
  */
  async function processGroupOfIncludes(arrayOfElements, path) {
    const html = await fetchHtml(path)
    
    arrayOfElements.forEach((includeEle) => includeEle.outerHTML = html)
  }
  
  /*
    Fetch the html from a path
  */
  async function fetchHtml(path) {
    const response = await fetch(path)
    const html = await response.text()
    return html
  }
})()
