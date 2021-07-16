/**
* index.js 1.0 juin 2021 by Alexandre CHARLIER  
*
* Author : Alexandre CHARLIER.
* GitHub : https://github.com/alexandre34000/AlexandreCharlier_6_03062021
* GitHub Pages :https://alexandre34000.github.io/AlexandreCharlier_6_03062021/.
* Theme Name : fisheye .
* Description : fichier pour le control de la page index.html.
* Date: juin 2021. 
*/

import { getAllPhotographes, getPhotographesByTags } from './scripts/webService.js'
import { createDomObject, removeNode } from './scripts/htmlElement.js'


// Check if Javascript is actived
var jsIsActive = document.getElementById('nojs');
if (jsIsActive) {
    jsIsActive.style.display = 'none';
    jsIsActive.setAttribute('aria-hidden', 'false');
    callAPiWithNbMax(6);
}

async function callAPiWithNbMax(num) {
    var apiFiles = await getAllPhotographes(num);
    createDomObject(apiFiles);
    toListener();
}

async function callApiWithFilterTags(tagName) {
    let name = tagName.toLowerCase().substring(1);
    let apiFileFilter = await getPhotographesByTags(name);
    removeNode(".layout-card");
    createDomObject(apiFileFilter);
    toListener();
}

function toListener() {
    const tags = document.getElementsByClassName("cmpt-tags__name");
    Array.from(tags).forEach(tag => {
        tag.onclick = (e) => {
            callApiWithFilterTags(e.target.textContent);
        };
    })
}

window.filterTags = function () {
    let tagName = "travel";
    callApiWithFilterTags(tagName);
}

const menuFixed = document.getElementById("content-scroll");
window.addEventListener('scroll', () => {
    menuFixed.dataset.value = (window.pageYOffset > 150 ? 'true' : 'false');
});

