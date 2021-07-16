/**
* webService.scss 1.0 juin 2021 by Alexandre CHARLIER  
*
* Author : Alexandre CHARLIER.
* GitHub : https://github.com/alexandre34000/AlexandreCharlier_6_03062021
* GitHub Pages :https://alexandre34000.github.io/AlexandreCharlier_6_03062021/.
* Theme Name : fisheye .
* Description : fichier pour la communication client serveur.
* Date: juin 2021. 
*/

const url = "./db.json";

async function loadJson() {
    let obj = null;
    try {
        obj = await (await fetch(url)).json();
        return obj;
    }
    catch (error) {
        console.log("une erreure" + error);
    }
}

export function getAllPhotographes(num) {
    let objectArray = [];
    return new Promise(resolve => {
        loadJson().then(data => {
            let authors = data.photographers;
            for (let i = 0; i < num; i++) {
                objectArray.push(authors[i])
            }
            return resolve(objectArray)
        })
            .catch((error) => {
                console.log(" erreur est survenue : " + error);
            });
    })
}

export function getPhotographesByTags(tagName) {
    let filterArray = [];
    return new Promise(resolve => {
        loadJson().then(data => {
            let authors = data.photographers;
            if (isNaN(tagName)) {
                var fil = authors.filter(author => author.tags.find(f => f == tagName))
            }
            for (let i of fil) {
                filterArray.push(i);
            }
            return resolve(filterArray);
        })
            .catch(error => {
                console.error(" erreur est survenue : " + error);
            });
    })
}

export function getHeaderByPhotographe(id) {
    return new Promise(resolve => {
        loadJson().then(data => {
            let response;
            response = data.photographers.filter(author => author.id == id);
            return resolve(response);
        })
            .catch((error) => {
                console.error("Une erreure est survenue : " + error);
            });
    })
}

export var arrayPhotographies = [];

export function getPicturesByPhotographe(id) {
    return new Promise(resolve => {
        loadJson().then(data => {
            var photographies = data.media.filter(author => author.photographerId == id);
            for (let i of photographies) {
                arrayPhotographies.push(i);
            }
            return resolve(arrayPhotographies);
        })
            .catch((error) => {
                console.error("Une erreure est survenue : " + error);
            });
    })
}