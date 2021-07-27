/**
* htmlElements.js  1.0 juin 2021 by Alexandre CHARLIER  
*
* Author : Alexandre CHARLIER.
* GitHub : https://github.com/alexandre34000/AlexandreCharlier_6_03062021
* GitHub Pages :https://alexandre34000.github.io/AlexandreCharlier_6_03062021/.
* Theme Name : fisheye .
* Description : fichier de création, modification et suppression des elements du DOM.
* Date: juin 2021. 
*/

var contentParent;

/* Create Element with alone Attribut*/
function createNode(element, attr, value) {
  let el = document.createElement(element);
  el.setAttribute(attr, value);
  return el;
}

function createNodeWithMultiplesAttributes(element, attributes) {
  let el = document.createElement(element);
  Object.entries(attributes).forEach(([key, value]) =>
    el.setAttribute(key, value));
  return el;
}

/* build elements DOM */
function append(parent, el) {
  return parent.appendChild(el);
}

/* remove element inside the DOM*/
export function removeNode(className) {
  document.querySelectorAll(className).forEach((n) => n.remove());
}

/* create cards of photographe inside index.html*/
export function createDomObject(objs) {
  contentParent = document.getElementById("authors");
  for (let obj of objs) {
    let section = createNode("section", "class", "layout-card");
    let a = createNodeWithMultiplesAttributes('a', {
      'href': `photographe.html?id=${obj.id}`,
      'class': "layout-card__link",
      'aria-labelledby': `layout-card__name-id${obj.id}`
    })
    let img = createNodeWithMultiplesAttributes('img', {
      'width': '350',
      'height': '350',
      'src': `./dist/pictures/pictures/Photographers_ID_Photos/${obj.portrait}`,
      'alt': `photo de ${obj.name}`,
      'class': 'layout-card__image'
    });
    let name = createNodeWithMultiplesAttributes('h2', {
      'class': 'layout-card__name',
      'id': `layout-card__name-id${obj.id}`
    })
    name.textContent = `${obj.name}`;
    let city = createNodeWithMultiplesAttributes('span', {
      'class': 'layout-card__city',
    })
    city.textContent = `${obj.city} ${obj.country}`;
    let tagline = createNode("span", "class", "layout-card__tagline");
    tagline.textContent = `${obj.tagline}`;
    let price = createNode("span", "class", "layout-card__price");
    price.textContent = `${obj.price} €/jour`;
    let tagsTable = createNodeWithMultiplesAttributes('ul', {
      'class': 'cmpt-tags__table',
      'aria-label': 'filtrer les photographes suivant tags',
    })
    for (let tag of obj.tags) {
      let tagsList = createNodeWithMultiplesAttributes('li', {
        'class': 'cmpt-tags__list',
      })
      let tagsLink = createNodeWithMultiplesAttributes('a', {
        'class': "cmpt-tags__navigation",
        'href': '#'
      })
      let tagsName = createNode("span", "class", "cmpt-tags__name");
      tagsName.textContent = `#${tag}`;
      append(tagsLink, tagsName)
      append(tagsList, tagsLink);
      append(tagsTable, tagsList);
    }
    append(a, img);
    append(a, name);
    append(section, a);
    append(section, city);
    append(section, tagline);
    append(section, price);
    append(section, tagsTable);
    append(contentParent, section);
  }
}

/* create cards of photograph inside page photgraph.html*/
export function createPagePhotographe(objs, name) {
  let photographName = name.replace(/ /g, "");
  let totalLikes = 0;
  let i=0;
  return new Promise((resolve, reject) => {
    contentParent = document.getElementById("content-main__center");
    for (let obj of objs) {
      var figure = createNodeWithMultiplesAttributes('figure', {
        'data-pos': 'false',
        'data-visibility': 'false',
        'data-modal': 'false',
        class: 'card',
      });
      let figcaption = createNodeWithMultiplesAttributes('figcaption', {
        class: "legend"
      });
      figcaption.textContent = obj.title;
      let span = createNodeWithMultiplesAttributes('span', {
        class: "number",
        'data-modal': 'false'
      });
      span.textContent = obj.likes;
      let icon = createNodeWithMultiplesAttributes('img', {
        class: "icone",
        'data-modal': 'false',
        src: "./dist/pictures/icons/heart-regular.svg",
        'alt': "like",
      });
      if (obj.image) {
        let img = createNodeWithMultiplesAttributes('img', {
          class: "picture",
          tabindex: "0",
          'data-modal': "false",
          src: `./dist/pictures/pictures/${photographName}/${obj.image}`,
          alt: `Photographie de ${photographName}, nommée ${obj.title} `
        });
        append(figure, img);
      } else if (obj.video) {
        let video = createNodeWithMultiplesAttributes('video', {
          class: "picture",
          'controls': "",
          'data-modal': "false"
        });
        let source = createNodeWithMultiplesAttributes('source', {
          type: "video/mp4",
          src: `./dist/pictures/pictures/${photographName}/${obj.video}`,
        });
        append(video, source);
        append(figure, video);
      }
      append(span, icon);
      append(figcaption, span)
      append(figure, figcaption);
      append(contentParent, figure);
      
      totalLikes = totalLikes + obj.likes;
    }
    resolve(totalLikes)
  })
}

/* set the value inside the header of photograph.html*/
export function fillHeaderPagePhotographe(obj) {
  contentParent = document.getElementById('content-main__header-bottom');
  document.getElementById('header-left__name').textContent = `${obj[0].name}`;
  document.getElementById('header-left__city').textContent = `${obj[0].city}`;
  document.getElementById('header-left__country').textContent = `${obj[0].country}`;
  document.getElementById('header-left__describ').textContent = `${obj[0].tagline}`
  let image = document.getElementById('header-right__logo');
  image.src = `./dist/pictures/pictures/Photographers_ID_Photos/${obj[0].portrait}`;
  image.alt = `Photo de ${obj[0].name}`;
  let tagsTable = createNodeWithMultiplesAttributes('ul', {
    'id': "header-bottom__table",
    'aria-label': "filtrer les photographes par tags suivant"
  })
  for (let i of obj[0].tags) {
    let tagsList = createNode("li", "class", "cmpt-tags__list");
    let tagsLink = createNodeWithMultiplesAttributes('a', {
      'class': "cmpt-tags__navigation",
      'href': "#"
    })
    let tagsName = createNode("span", "class", "cmpt-tags__name");
    tagsName.textContent = `#${i}`;
    append(tagsLink, tagsName)
    append(tagsList, tagsLink);
    append(tagsTable, tagsList);
  }
  append(contentParent, tagsTable);
  let myStorage = localStorage;
  myStorage.setItem('name', `${obj[0].name}`);
}
