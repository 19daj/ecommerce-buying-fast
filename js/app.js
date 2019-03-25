var searchProducts = $("#search-bttn");
var search = $('#search-input');
var searchVal;
var productTitle;
var productPrice$;
var count = 0;
var array = [];

searchProducts.click(function (e) {
    e.preventDefault();
    searchVal = search.val().toLowerCase();
    search.val("");
    if (searchVal.length !== 0) {
        $('#info-container').empty();
        $('#tittle').empty();
    }
    gettingData();
});

function gettingData() { //Función que obtiene el producto que busque el usuario
    $.ajax({
        url: `https://api.mercadolibre.com/sites/MLM/search?q=${searchVal}`,
        contentType: 'application/json',
        method: 'GET',
        crossDomain: true,
        success: function (data) {
            //console.log(data);

            var tempTittle = `<h5 id="title"><strong>${"Búsqueda: "}${searchVal}</strong></h5>`
            if (searchVal.length !== 0) {
                $('#tittle').append(tempTittle);
            }

            for (var i = 0; i < data.results.length; i++) {
                var pic = data.results[i].thumbnail;
                //console.log(data.results[i]);
                productTitle = data.results[i].title;
                productPrice$ = data.results[i].price;
                var productState = data.results[i].address["state_name"];
                var productCity = data.results[i].address["city_name"];
                var card = `<div class="card white">
                                    <div id="card" class="card-content black-text">
                                        <img id="card-img" class="responsive-img" src="${pic}" alt="Card image cap">
                                        <h5 id="title" class="card-title">${productTitle}</h5>
                                        <h6 id="state" class="card-state">${"Ciudad del vendedor: "}${productState}${","}${productCity}</h6>
                                        <p id="price" class="card-price"><strong>${productPrice$}</strong></p><br>   
                                        <button id="addCar" class="car" data-product="${productTitle}" data-price="${productPrice$}">Comprar</button>
                                    <div>
                                </div>`;

                $('#info-container').append(card);
            }
            $('.car').click(getElementsCart);
        },
    });
}

function getAll() { //Función que obtiene las categorías de los productos
    $.ajax({
        url: `https://api.mercadolibre.com/sites/MLM/categories`,
        headers: {
            'Access-Control-Allow-Origin': 'htt://site allowed to access'
        },
        type: 'GET',
        datatype: 'jsonp',
        crossDomain: true
    }).done(
        function (response) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                var nameCategories = response[i].name;
                var idCategories = response[i].id;
                var templateCategories = `<div class="card white row" class="center-align">
                                            <div class="card-content black-text center-align">
                                                <p data-categorie="${idCategories}" class="card-title template">${nameCategories}</p>
                                            </div>
                                        </div>`;
                $('#info-container').append(templateCategories);
            }

            $('.template').click(function (e) {
                var element = e.target;
                //console.log(element);
                var categoryData = $(element).attr('data-categorie');
                //console.log(categoryData);
                $('#info-container').empty();
                productCategories(categoryData);
            });
        }
    ).fail(error);
}

function error() {
    alert("No se pueden cargar los datos");
}

$('#home').click(function () { //Función para limpiar pantalla 
    $('#info-container').empty();
    $('#tittle').empty();
    getAll();
});

function productCategories(cateData) { //Función para obtener cada artículo por categoría
    $.ajax({
        url: `https://api.mercadolibre.com/sites/MLM/search?category=${cateData}`,
        type: 'GET',
        datatype: 'json',
        crossDomain: true
    }).done(getOne).fail(error);

    function getOne(response) {
        console.log(response);

        for (var i = 0; i < response.results.length; i++) {
            var photoProduct = response.results[i].thumbnail;
            var nameProduct = response.results[i].title;
            var costProduct = response.results[i].price;
            //console.log(photoProduct);
            var shipping = response.results[i].address.state_name + ',' + response.results[i].address.city_name;
            //console.log(shipping);
            var template = `<div data-card="card" class="card white">
                                    <div class="card-content center-align black-text">
                                        <img class="card-img-top" src="${photoProduct}" alt="Card image cap">
                                        <h5 class="card-title">${nameProduct}</h5>
                                        <p class="price card-text">${costProduct}</p>
                                        <hr>
                                        <p>Ciudad del vendedor: ${shipping}</p>
                                        <hr>
                                        <button class="addingCar car" data-product="${nameProduct}" data-price= "${costProduct}"">Comprar</button>
                                     </div>
                                </div>`;

            $('#info-container').append(template);
        }
        $('.car').click(getElementsCart);
    }
}

function error() {
    alert("No se pueden cargar los datos");
}

function getElementsCart(e) {
    var elem = e.target;
    var nameProductCar = $(elem).attr('data-product');
    var priceProductCar = $(elem).attr('data-price');
    var templateModal = `<table>
                                <thead>
                                    <tr>
                                        <th>Precio</th>
                                        <th>Producto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td id="price-modal">${priceProductCar}</td>
                                        <td id="product-modal">${nameProductCar}</td>
                                    </tr>
                                </tbody>
                            </table>`;

    $('#text-mdl').append(templateModal);
    count += 1;

    $('#count').text(count);

    array.push(parseFloat(priceProductCar));
    console.log(array);

    function addArray(array) {
        var suma = 0;
        array.forEach(function (numero) {
            suma += numero;
        });
        return suma;
    }

    var sumar = addArray(array);

    $('#total').html(`<strong>TOTAL: $${sumar}</strong>`);
};

$(document).ready(function () {
    getAll();
    $('.modal').modal();
});