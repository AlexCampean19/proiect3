function randareHtmlSlider() {
    let template = '';
    let slider = JSON.parse(sessionStorage.getItem('categorii'));
    let categoryId = window.location.search ? window.location.search.replace('?category_id=', '') : '';
    if (slider) {
        for (const [key, value] of Object.entries(slider)) {
            jQuery('.categori h2').text('Categories')
            let url = value.custom_attributes[0].value;

            template += '<div class=card2><a data-id=' + value.id + ', href="index.html?category_id= ' + value.id + '"><img src ="https://magento-demo.tk' + url + '", alt=' + value.name + ', title=' + value.name + '></a><h3>' + value.name + '</h3></div>';


        }
        jQuery('ul.glide__slides ').append(template);

    }
    const config = {
        type: 'carousel',
        startAt: 0,
        perView: 7,
        breakpoints: {
            700: { perView: 1 },
            1200: {
                perView: 2
            },
            1400: {
                perView: 4
            },
            1700: {
                perView: 5
            },
            1900: {
                perView: 6
            },
        }
    };
    new Glide('.glide', config).mount();
}

function TitluCategorie(categoryId) {
    let url = 'https://magento-demo.tk/rest/V1/categories/' + categoryId;
    jQuery.ajax({
        url: url
    }).done(function(result) {
        jQuery('h1').text(result.name)
    })
};



function randareHTMLProduse() {
    let categoryId = window.location.search ? window.location.search.replace('?category_id=', '') : '';
    let token = sessionStorage.getItem('token');
    let template = "";
    let url = "";
    if (categoryId) {
        TitluCategorie(categoryId);
        url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=' + categoryId + '&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes]'
    } else {
        jQuery('h1').text('All Products')
        url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=41&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes[description]]';
    }
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        headers: { "Authorization": "Bearer " + token }
    }).done(function(response) {
        for (const [key, value] of Object.entries(response.items)) {
            template += '<div class="card1" data-sku="' + value.sku + '"><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><p></p><img  src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';

        }
        jQuery(".cardfructe").append(template);
        jQuery(document).trigger('produse');
        specialPrice2()
    }).fail(function(response) {
        console.log(response);
    })
}




function randareSearch() {
    let searchName = window.location.search ? window.location.search.replace('?search+=', '') : '';
    let token = sessionStorage.getItem('token');
    let template = "";
    let url = "";
    if (searchName) {
        jQuery('h1').text(searchName);
        url = 'https://magento-demo.tk/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25' + searchName + '%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like&fields=items[name,sku,price,special_price,weight,media_gallery_entries,custom_attributes[description]]';
    }
    jQuery.ajax({
        method: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: url,
        headers: { "Authorization": "Bearer " + token }
    }).done(function(response) {
        console.log(response)
        for (const [key, value] of Object.entries(response.items)) {
            template += '<div class="card1" data-sku="' + value.sku + '" ><a class="fruct " href="https://alexcampean19.github.io/proiect3/detalii?sku=' + value.sku + ' "><img "src="https://magento-demo.tk/media/catalog/product/' + value.media_gallery_entries[0].file + '"/></a><div class="detalii "><a href="https://alexcampean19.github.io/proiect2/detalii " class="nume ">' + value.name + '</a><p class="gramaj ">' + value.weight + 'g</p><div class="detalii2 "><p class="pret ">$' + value.price + '</p><div class="stele "><p class="unu "><span>stea</span></p><p class="doi "><span>stea</span></p></div><a class="salemb "><span class="mbbuy ">Add to cart</span></a></div></div></div>';
        }
        jQuery(".cardfructe").append(template);

    }).fail(function(response) {
        console.log(response);
    })
}



function specialPrice2() {
    let url = 'https://magento-demo.tk/rest/V1/products/special-price-information';
    let skupret = JSON.parse(sessionStorage.getItem('produse'));
    for (const [key, value] of Object.entries(skupret)) {
        console.log([value.sku])
        let token = sessionStorage.getItem('token');
        jQuery.ajax({
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            headers: { "Authorization": "Bearer " + token },
            url: url,
            dataType: "json",
            data: JSON.stringify({
                "skus": [
                    value.sku
                ]
            })
        }).done(function(result) {
            const pret = JSON.parse(sessionStorage.getItem('price'))
            if (pret) {
                for (const [key, value] of Object.entries(pret)) {
                    if (new Date < value.price_to) {
                        jQuery('.pret').html(value.price + '$')
                        jQuery('.fruct p').addClass('oferte').text('Sale');
                        if (new Date > value.price_from) {
                            let prod = sessionStorage.getItem('produse');
                            console.log(JSON.parse(prod))
                            for (const [key, value] of Object.entries(JSON.parse(prod))) {
                                console.log(value.price)
                                jQuery('.pret').text(value.price + '$')

                            }
                        } else {
                            jQuery('.pret').html(value.price + '$')
                            jQuery('.fruct p').addClass('oferte').text('Sale');
                        }
                    } else {
                        let prod = sessionStorage.getItem('produse');
                        console.log(JSON.parse(prod))
                        for (const [key, value] of Object.entries(JSON.parse(prod))) {
                            console.log(value.price)
                            jQuery('.pret').text(value.price + '$')

                        }
                    }
                }
            } else {
                sessionStorage.setItem('price', JSON.stringify(result))
            }


        }).fail(function(result) {
            console.log(result)
        })
    }

}

jQuery(document).on("Loader", function(event) {

    if (window.location.search.indexOf('?search') > -1) {
        randareSearch()
    } else {
        randareHTMLProduse();

    }
    randareHtmlSlider();
})
jQuery(function() {
    jQuery('#listaSelector').change(function() {
        sessionStorage.setItem('selectat', this.value);
        location.reload()
    });
    if (sessionStorage.getItem('selectat')) {
        jQuery('#listaSelector').val(sessionStorage.getItem('selectat'));

    } else {
        jQuery('#listaSelector').val('12');

    }

})
jQuery(document).on('produse', function(event) {
    jQuery('.fructe .cardfructe').paginate({
        'perPage': sessionStorage.getItem('selectat') ? sessionStorage.getItem('selectat') : '12'
    })
    console.log(sessionStorage.getItem('selectat') ? sessionStorage.getItem('selectat') : '12')

    if (!sessionStorage.getItem('selectat')) {
        jQuery('.det1').text('Showing ' + (localStorage.getItem('seletat') - (localStorage.getItem('seletat') - 1)) + ' - ' + localStorage.getItem('seletat') + ' of ' + jQuery('.card1').length + ' products');
    } else {
        jQuery('.det1').text('Showing ' + (sessionStorage.getItem('selectat') - (sessionStorage.getItem('selectat') - 1)) + ' - ' + sessionStorage.getItem('selectat') + ' of ' + jQuery('.card1').length + ' products');

    }

})