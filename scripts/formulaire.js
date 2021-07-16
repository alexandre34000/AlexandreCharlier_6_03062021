/**
* formulaire.js 1.0 juin 2021 by Alexandre CHARLIER  
*
* Author : Alexandre CHARLIER.
* GitHub : https://github.com/alexandre34000/AlexandreCharlier_6_03062021
* GitHub Pages :https://alexandre34000.github.io/AlexandreCharlier_6_03062021/.
* Theme Name : fisheye .
* Description : fichier pour la gestion du formulaire de contact.
* Date: juin 2021. 
*/

const params = new URL(window.location.href).searchParams;
const modalbg = document.querySelector("#container-main__formulaire");
const modalBtnClose = document.querySelectorAll(".closeModal");
const submitBtn = document.querySelector("#submit");
const modalBody = document.querySelector(".modal-body");
const msgBox = document.querySelector("#container-msg");
const spinner = document.querySelector("#container-spinner");
const main = document.querySelector("#main");
const formulaire = document.querySelector(".content-main__formulaire");
const footer = document.getElementById("footer");
var photographeName = params.get("name");

modalBtnClose.forEach((btnClose) => {
  btnClose.addEventListener("click", closeModal);
  btnClose.addEventListener("keydown", closeModal);
});

// close modal form
function closeModal(e) {
  if (e.key != "Tab" || e.type === "click") {
  modalbg.style.display = "none";
  formulaire.setAttribute('aria-hidden', 'true');
  main.setAttribute('aria-hidden', 'false');
  }
}

//open modal form
function openModal(){
  main.setAttribute('aria-hidden', 'true');
  formulaire.setAttribute('aria-hidden', 'false');
  document.querySelector(".modal-name").textContent = photographeName;
  modalbg.style.display = "flex";
  modalbg.focus();
}

//send formData and display spinner before displaying the answer of serveur
async function sendFormData() {
  let formData = document.getElementById('reserve');
  let form = new FormData(formData);
  // print formData in console
  for(let frm of form){
    console.log(frm);
  }
  spinner.style.display = "initial";
  let textResponse;
  let response = await simulResponseServeur();
  if (response) {
    modalBody.style.visibility = "hidden";
    spinner.style.display = "none";
    textResponse = (response == "200" ? "Thanks you for submitting your registration details" : "An error occured, please try again !");
  }
  document.getElementById("content-msg__serveur").textContent = textResponse;
  msgBox.style.display = "block";
}

// simulation of response serveur, time at 2 secondes
const simulResponseServeur = () => {
  return new Promise(resolve => {
    setTimeout(() => { resolve("200"); }, 2000);
  });
}

// entries of formulaire for check the constrainte
function validate() {
  const errorObject = toCheckErrors();
  if (Object.keys(errorObject).length != 0) {
    submitBtn.disabled = true;
    Object.entries(errorObject).forEach(([key, value]) => {
      displayErrorMessage(key, value);
      toAddListener(key, value);
    });
  }
  else {
    sendFormData();
  }
  return false;
}

// push message error to content of form:after
const displayErrorMessage = (key, value) => {
  let currentDiv = document.getElementById(key).parentElement;
  currentDiv.dataset.error = 'true';
  currentDiv.dataset.errorMessage = `${value}`
  currentDiv.setAttribute('aria-invalid', 'true');
}

// check if message error is present inside formulaire
const checkMsgWarningInDom = () => {
  const error = document.querySelectorAll("div[data-error='true']");
  if (error.length == 0) {
    submitBtn.disabled = false;
  }
}

// Remove message error
const toRemoveMsgError = (key) => {
  let parent = document.getElementById(key).parentElement;
  parent.dataset.error = 'false';
  parent.setAttribute('aria-invalid', 'false');
  checkMsgWarningInDom();
}

// Add listener for each input value in error
const toAddListener = (key, value) => {
  let id = document.getElementById(key);
  id.addEventListener("input", function valideConstrainst(e) {
    var errorMsg = valide(id, formConstraints[key]);
    if (errorMsg == "") {
      id.removeEventListener("input", valideConstrainst);
      toRemoveMsgError(key);
    }
  });
}

// Valid inputField with his constraints
const valide = (element, vali) => {
  return vali.map((validator) => validator(element));//.filter((error) => error);
}

// validators return message if entry don't pass the validator
const validators = {
  minLength: (expectedMinLength) => (element) => {
    if (element.value.trim().length < expectedMinLength) {
      return ` ${expectedMinLength} lettres au minimum `;
    }
  },
  email: (element) => {
    var reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!reg.test(element.value)) {
      return 'Email non conforme';
    }
  }
}

//constraints of input
const formConstraints = {
  first: [validators.minLength(2)],
  last: [validators.minLength(2)],
  email: [validators.email]
}

// To check validity
function toCheckErrors() {
  const formErrors = {
    first: valide(document.getElementById("first"), formConstraints.first),
    last: valide(document.getElementById("last"), formConstraints.last),
    email: valide(document.getElementById("email"), formConstraints.email),
  }
  const removeEmptyValues = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v != ""));
  }
  return removeEmptyValues(formErrors);
}


