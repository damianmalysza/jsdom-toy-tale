let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.querySelector("#toy-collection")
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  
  fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(json => {
    for (toy of json){
      toyCollection.appendChild(createCardForToy(toy))
    }
  })
  
  toyForm.addEventListener("submit", e => {
    let inputValues = document.querySelectorAll("input[type=text]")
    let toyData = {}
    for (value of inputValues){
      toyData[value.name] = value.value
    }
    toyData.likes = 0
    fetch("http://localhost:3000/toys",toyRequest(toyData))
  })
  
  
  function toyRequest(toyData){
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body:JSON.stringify(toyData)
    }
  }
  
  
  function createCardForToy(toy){
    let card = document.createElement("div")
    card.className = "card"
    
    let heading = document.createElement("h2")
    heading.innerText = toy.name
    card.appendChild(heading)
    
    let img = document.createElement("img")
    img.src = toy.image
    img.className = "toy-avatar"
    card.appendChild(img)
    
    let likes = document.createElement("p")
    likes.innerText = `${toy.likes} Likes`
    card.appendChild(likes)
    
    let button = document.createElement("button")
    button.className = "like-btn"
    button.innerText = "Like <3"
    card.appendChild(button)
    button.setAttribute('id',toy.id)
    button.addEventListener("click",likeToy)
    
    return card
  }
  
  function likeToy(event){
    let toyId = event.target.id 
    addLikeToToy(toyId)
  } 
  
  function addLikeRequest(currentLikes){
    return {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        "likes": `${currentLikes + 1}`
      })
    }
  }
  
  function addLikeToToy(toyId){
    const url = `http://localhost:3000/toys/${toyId}` 
    fetch(url)
    .then(response => response.json())
    .then(json => {
      let likes = json.likes
      fetch(url,addLikeRequest(likes))
    })
  }

});
