/*
 *  Title:          Project 2. Product showcase/web shop
 *  Author:         Nerea Salamero Labara
 *  Date:           2025-02-10
 *  File:           script.js
 *  Subject:        Browser Programming
 *  Description:    A product showcase or web shop with basic interactivity. Follow
 *                  the guidelines provided to ensure your project meets the requirements.
 */
$(document).ready(function() {
    const productList = JSON.parse(localStorage.getItem("products")) || [];
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateProductList() {
        $('#product-list').empty();
        productList.forEach(function(product, index) {
            const productItem = $(`
                <div class="product">
                    <h4><strong>${product.name}</strong> - $${product.price}</h4>
                    <img src="${product.image || 'https://via.placeholder.com/50'}" alt="Product Image" height="50">
                    <button class="view-details">View Details</button>
                    <button class="add-to-cart" data-index="${index}">Add to Cart</button>
                    <div class="product-details" style="display:none;">
                        <p><strong>Description:</strong> ${product.description}</p>
                    </div>
                </div>
            `);
            $('#product-list').append(productItem);
        });

        // Bind events for the "View Details" button
        $('.view-details').click(function() {
            $(this).siblings('.product-details').slideToggle();
        });

        // Bind events for the "Add to Cart" button
        $('.add-to-cart').click(function() {
            const index = $(this).data('index');
            const product = productList[index];
            cart.push(product);
            updateCart();
            localStorage.setItem('cart', JSON.stringify(cart));
        });
    }

    function updateCart() {
        $('#cart-counter').text(cart.length);
        $('#cart-total').text(cart.reduce((total, product) => total + product.price, 0).toFixed(2));
        $('#cart-summary').empty();
        cart.forEach(function(product, index) {
            const cartItem = $(`<li>${product.name} - $${product.price}</li>`);
            $('#cart-summary').append(cartItem);
        });
    }

    $('#product-form').submit(function(event) {
        event.preventDefault();

        const name = $('#product-name').val();
        const price = parseFloat($('#product-price').val());
        const description = $('#product-description').val();
        const image = $('#product-image').val();

        if (!name || isNaN(price)) {
            alert('Please fill in the required fields correctly.');
            return;
        }

        const newProduct = { name, price, description, image };
        productList.push(newProduct);
        localStorage.setItem("products", JSON.stringify(productList));

        $('#product-form')[0].reset();
        updateProductList();
    });

    $('#search').keyup(function() {
        const searchTerm = $(this).val().toLowerCase();
        $('#product-list .product').filter(function() {
            const name = $(this).find('h4').text().toLowerCase();
            $(this).toggle(name.includes(searchTerm));
        });
    });

    $('#clear-cart').click(function() {
        cart.length = 0;
        localStorage.removeItem('cart');
        updateCart();
    });

    updateProductList();
    updateCart();
});
