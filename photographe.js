/**
* photographe.js  1.0 juin 2021 by Alexandre CHARLIER  
*
* Author : Alexandre CHARLIER.
* GitHub : https://github.com/alexandre34000/AlexandreCharlier_6_03062021
* GitHub Pages :https://alexandre34000.github.io/AlexandreCharlier_6_03062021/.
* Theme Name : fisheye .
* Description : fichier pour le control de la page photographe.html.
* Date: juin 2021. 
*/

import { removeNode, createPagePhotographe, fillHeaderPagePhotographe } from './scripts/htmlElement.js';
import { getPicturesByPhotographe, getHeaderByPhotographe } from './scripts/webService.js';

const params = new URL(window.location.href).searchParams;
const utilityModal = document.querySelectorAll('[data-utility]');
const closeIcon = document.getElementById('close-modal');
const filterBtn = document.getElementById('filter-button_one');
const filterBtns = document.querySelectorAll('[data-filter]');
const contentSlider = document.getElementById('container-main__center');
var photographeId = params.get("id");
var cards;
var currentPicture;
var open = false;
var file;
var price;

function addEvent() {
    closeIcon.addEventListener('click', closeSlider);
    closeIcon.addEventListener('keydown', closeSlider);
    filterBtn.addEventListener('click', selectedFilter);
    filterBtn.addEventListener('keydown', selectedFilter);
    filterBtns.forEach(el => {
        el.addEventListener('keydown', selectedFilter);
        el.addEventListener('click', selectedFilter);
    });
}

function selectedFilter(e) {
    if (!open && (e.key != "Tab" || e.key == "ArrowDown")) {
        filterBtn.dataset.filtermain = "true";
        filterBtn.setAttribute("aria-expanded", "true");
        filterBtns.forEach(el => {
            el.style.display = "block";
            el.dataset.filter = "true";
        });
        open = true;
    } else {
        if (e.key != "Tab") {
            let value = filterBtn.textContent;
            filterBtn.textContent = e.target.textContent;
            filterBtn.setAttribute("aria-label", `Le trie est actuellement par ${e.target.textContent}`);
            e.target.textContent = value;
            e.target.setAttribute("aria-label", `Triez par ${value}`);
            filterBtn.dataset.filtermain = "false";
            filterBtn.setAttribute("aria-expanded", "false");
            filterBtns.forEach(el => {
                el.style.display = "none";
                el.dataset.filter = "false"
            });
            open = false;
            getPictures(filterBtn.textContent.replace(/ /g, ""));
        }
    }
}

async function getHeader() {
    const headerObjs = await getHeaderByPhotographe(photographeId);
    fillHeaderPagePhotographe(headerObjs);
    price = headerObjs[0].price;
    document.getElementById('price').textContent = `${price}€ / jour`;
}

async function getPictures(filter) {
    if (typeof file === "undefined") {
        file = await getPicturesByPhotographe(photographeId);
    } else {
        removeNode(".card");
    }
    switch (filter) {
        case "Popularité":
            file.sort((a, b) => b.likes - a.likes);
            break;
        case "Titre":
            file.sort((a, b) => (a.title > b.title) - (a.title < b.title));
            break;
        case "Date":
            file.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        default:
            file.sort((a, b) => b.likes - a.likes);
    }
    let name = localStorage.getItem('name');
    let totalLikes = await createPagePhotographe(file, name);
    let pictures = document.querySelectorAll(".picture")
    for (let p of pictures) {
        p.addEventListener('click', openSlider);
        p.addEventListener('keydown', openSlider);
    }
    document.getElementById('nb-likes').textContent = totalLikes;
    var like = document.querySelectorAll(".number");
    for (let l of like) {
        l.addEventListener('click', increment);
    }
}

function toNavigate(e) {
    if (e.key != "Tab" && e.key != "Shift") {
        if (e.key == "ArrowLeft" || e.target.id == "nav-prev") {
            aftPicture();
        }
        else if (e.key == "ArrowRight" || e.target.id == "nav-fwd") {
            fwdPicture();
        }
        else if (e.key == "Escape") {
            closeSlider(e);
        }
    }
}

function toPrintSliders(bol) {
    let dataModal = document.querySelectorAll('[data-modal]');
    cards = document.querySelectorAll(".card");
    cards.forEach(el => {
        bol === "true" ? el.style.opacity = 0 : el.style.opacity = 1;
        el.dataset.pos = `${bol}`;
        el.tabIndex = "-1";
    });
    currentPicture.style.opacity = 1;
    currentPicture.style.zIndex = 10;
    dataModal.forEach(el => {
        el.dataset.modal = `${bol}`
    });
    utilityModal.forEach(el => {
        el.dataset.utility = `${bol}`;
    });
    contentSlider.focus();
    contentSlider.addEventListener('keyup', toNavigate);
}

function increment(e) {
    let target = e.currentTarget.childNodes[0].nodeValue;
    let total = parseInt(target) + 1;
    e.currentTarget.childNodes[0].nodeValue = total.toString();
}

function openSlider(e) {
    currentPicture = e.currentTarget.parentElement;
    if (e.key === "Enter" || e.type === "click") {
        toPrintSliders("true");
    }
}

function closeSlider(e) {
    if (e.key != "Tab" && e.key != "Shift") {
        toPrintSliders("false");
    }
}

function toChangeSlide(value) {
    let otherPicture;
    currentPicture.style.opacity = 0;
    currentPicture.style.zIndex = 0;
    let i = cards.length;
    if (value == "aft") {
        currentPicture === cards[0] ? otherPicture = card[i - 1] : otherPicture = currentPicture.previousSibling;
    } else {
        currentPicture === cards[i - 1] ? otherPicture = card[0] : otherPicture = currentPicture.nextSibling;
    }
    otherPicture.style.opacity = 1;
    otherPicture.style.zIndex = 10;
    currentPicture = otherPicture;
}

window.aftPicture = function () {
    toChangeSlide("aft");
}

window.fwdPicture = function () {
    toChangeSlide("fwd");
}

getHeader();
getPictures();
addEvent();
