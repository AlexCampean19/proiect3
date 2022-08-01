async function apiCall(url, auth, authTipe, methodType) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "PHPSESSID=4lqf2uaojvmavdinfdg0gd4dob");
    if (authTipe == 'login') {
        var raw = JSON.stringify(auth);
        var requestOptions = {
            method: methodType,
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    }
    if (authTipe == 'token') {
        myHeaders.append("Authorization", "Bearer " + auth.replace(/['"]+/g, ''));
        var requestOptions = {
            method: methodType,
            headers: myHeaders,
            redirect: 'follow'

        };
    }

    return fetch(url, requestOptions)
        .then(response => {
            return response.text().then((result) => {
                    return result;
                })
                .catch(error => console.log('error', error));
        })
}

function loginToken(username, password) {
    let credentiale = {
        'username': username,
        'password': password
    }
    let url = 'https://magento-demo.tk/rest/V1/integration/admin/token';
    let verificare = sessionStorage.getItem('token');
    if (!verificare || verificare === 'undefiend') {
        let interval = setInterval(() => {
            let token;
            apiCall(url, credentiale, 'login', 'POST').then(result => {
                token = result;
                sessionStorage.setItem('token', token);
            });
            if (sessionStorage.getItem('token')) {
                clearInterval(interval);
                document.querySelector("#loader").style.display = "none";
            }
        }, 1000);
    }
}

loginToken('integrare', 'admin123');
document.addEventListener('DOMContentLoaded', function(event) {
    let intervalcategorii = setInterval(function() {
        if (sessionStorage.getItem('token')) {
            //tot cu display none;
            getCategorii().then(randareHTML()).then(randareHtmlSlider());
            getProduse().then(randareHTMLProduse());
            console.log('test');
            clearInterval(intervalcategorii);
            document.querySelector("#loader").style.display = "none";
            document.querySelector('body').classList.remove('noscroll');
        }
    }, 500);

    async function getCategorii() {
        let token = sessionStorage.getItem('token');
        let url = 'https://magento-demo.tk/rest/V1/categories/list?searchCriteria[filterGroups][0][filters][0][field]=parent_id&searchCriteria[filterGroups][0][filters][0][value]=41&searchCriteria[filterGroups][0][filters][0][conditionType]=eq&fields=items[id,parent_id,name,image,custom_attributes[image]]';
        if (!sessionStorage.getItem('categorii')) {
            await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
                sessionStorage.setItem('categorii', result);
                let categoryId = window.location.search ? window.location.search.replace('?category_id=', '') : '41';
                randareHTML(categoryId);
                randareHtmlSlider();
                return result;
            });
        };
    };

    function randareHTML() {
        let categorii = JSON.parse(sessionStorage.getItem('categorii'));
        if (categorii) {
            for (const [key, value] of Object.entries(categorii.items)) {
                let meniu = document.createElement('li');
                document.querySelector("ul.menu .partea1").appendChild(meniu);
                let link = document.createElement('a');
                link.setAttribute('href', '?category_id=' + value.id);
                meniu.appendChild(link);
                link.innerText = value.name;
            }
        }
    }

    function randareHtmlSlider() {
        let slider = JSON.parse(sessionStorage.getItem('categorii'));
        if (slider) {
            for (const [key, value] of Object.entries(slider.items)) {
                let url = value.custom_attributes[0].value,
                    slide = document.createElement('li'),
                    div = document.createElement('div'),
                    h3 = document.createElement('h3'),
                    link = document.createElement('a'),
                    img = document.createElement('img');
                slide.classList.add('glide__slide');
                div.classList.add('card2');
                link.setAttribute('data-id', value.id);
                img.setAttribute('src', 'https://magento-demo.tk' + url);
                img.setAttribute('alt', value.name);
                img.setAttribute('title', value.name);
                h3.innerText = value.name;
                document.querySelector('ul.glide__slides ').appendChild(slide);
                slide.appendChild(div);
                div.appendChild(link);
                link.appendChild(img);
                div.appendChild(h3);
                console.log(url);
            }
            // Create the event.
            var event = document.createEvent('HTMLEvents');
            // Define that the event name is 'build'.
            event.initEvent('slider', true, true);
            // Listen for the event.
            // Target can be any Element or other EventTarget.
            document.dispatchEvent(event);
        }
    }

    async function getProduse() {
        let token = sessionStorage.getItem('token');
        let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=41&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
        if (!sessionStorage.getItem('produse')) {
            await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
                sessionStorage.setItem('produse', result);
                randareHTMLProduse();
                return result;
            });
        };
    };

    async function randareHTMLProduse() {
        let produse = JSON.parse(sessionStorage.getItem('produse'));
        let categoryId = window.location.search ? window.location.search.replace('?category_id=', '') : '';
        console.log(categoryId);
        if (categoryId) {
            let token = sessionStorage.getItem('token');
            let url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=' + categoryId + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]';
            await apiCall(url, token.replace(/"/g, ''), 'token', 'GET').then(result => {
                console.log(result.items);
                for (const [key, value] of Object.entries(JSON.parse(result).items)) {
                    let template = '<div class="card1 "><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div>';
                    document.querySelector(".cardfructe").innerHTML += template;
                }
            });
        } else {
            if (produse) {
                for (const [key, value] of Object.entries(produse.items)) {
                    console.log(value.custom_attributes.filter(x => x.attribute_name == 'category_ids'));
                    let template = '<div class="card1 "><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii "><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div>';
                    document.querySelector(".cardfructe").innerHTML += template;

                }
            }
        }
    }
})