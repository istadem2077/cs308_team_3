$(document).ready(function() {
    
    // =================================================================
    // APP STATE
    // =================================================================
    
    let productsCache = []; // We will fetch products from the API and store them here.
    
    // Maps category IDs (from URL) to their display names.
    const categoryNames = {
        '1': 'Vitamins',
        '2': 'Fish Oils',
        '3': 'Minerals',
        '4': 'New Products',
        '5': 'Discounted Products',
        'all': 'All Products'
    };

    // =================================================================
    // CART FUNCTIONS (using localStorage)
    // =================================================================
    
    /** Gets the cart from localStorage */
    function getCart() {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    /** Saves the cart to localStorage */
    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartIcon();
    }

    /** Adds an item to the cart */
    function addToCart(productId, quantity) {
        let cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === productId);
        
        // Find the product in our cache.
        const product = productsCache.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found in cache!');
            return false;
        }

        // --- Stock Check ---
        const itemInCart = cart.find(item => item.id === productId);
        const currentCartQuantity = itemInCart ? itemInCart.quantity : 0;
        
        if (currentCartQuantity + quantity > product.quantity) {
            console.error("Not enough stock!");
            return false; // Signal that adding failed
        }
        // --- End Stock Check ---


        if (existingItemIndex > -1) {
            // Update quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            // Note: we adapt the API's 'image_url' to the cart's 'image'
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image_url, // Adapted from new API structure
                quantity: quantity
            });
        }
        saveCart(cart);
        return true; // Signal that adding was successful
    }

    /** Removes an item from the cart */
    function removeFromCart(productId) {
        let cart = getCart().filter(item => item.id !== productId);
        saveCart(cart);
    }

    /** Updates the quantity of a cart item */
    function updateCartQuantity(productId, newQuantity) {
        // Find product to check stock
        const product = productsCache.find(p => p.id === productId);
        if (!product) {
            console.error("Product not found, removing from cart");
            removeFromCart(productId);
            return;
        }

        // Clamp quantity to max stock
        if (newQuantity > product.quantity) {
            newQuantity = product.quantity;
        }

        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = newQuantity;
            saveCart(cart);
        }
    }

    /** Updates the cart icon counter */
    function updateCartIcon() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const $cartCount = $('#cart-item-count');
        
        if (totalItems > 0) {
            $cartCount.text(totalItems).removeClass('hidden');
        } else {
            $cartCount.addClass('hidden');
        }
    }


    // =================================================================
    // PAGE RENDERING FUNCTIONS
    // =================================================================

    /** Hides all pages and shows the one with the given ID */
    function showPage(pageId) {
        $('#page-home').addClass('hidden');
        $('#page-category').addClass('hidden');
        $('#page-product').addClass('hidden');
        $('#page-cart').addClass('hidden');
        $(pageId).removeClass('hidden');
        window.scrollTo(0, 0);
    }

    /** Renders the Home page dynamically */
    function renderHomePage() {
        // Populate Mini Product Previews (Products 1 and 4)
        const $miniPreviews = $('#mini-product-previews');
        $miniPreviews.empty();
        const product1 = productsCache.find(p => p.id === 1);
        const product4 = productsCache.find(p => p.id === 4);
        
        if (product1) {
            $miniPreviews.append(`
                <a href="#product=1" class="bg-white p-2 rounded-lg shadow-sm text-center block hover:shadow-md">
                    <img src="${product1.image_url}" alt="${product1.name}" class="mx-auto h-16 w-16 object-contain mb-2">
                    <p class="text-xs font-semibold h-8 overflow-hidden">${product1.name}</p>
                    <p class="text-sm font-bold text-red-600">${product1.price.toFixed(2)} TL</p>
                </a>
            `);
        }
        if (product4) {
            $miniPreviews.append(`
                <a href="#product=4" class="bg-white p-2 rounded-lg shadow-sm text-center block hover:shadow-md">
                    <img src="${product4.image_url}" alt="${product4.name}" class="mx-auto h-16 w-16 object-contain mb-2">
                    <p class="text-xs font-semibold h-8 overflow-hidden">${product4.name}</p>
                    <p class="text-sm font-bold text-red-600">${product4.price.toFixed(2)} TL</p>
                </a>
            `);
        }

        // Populate Featured Deals (First 5 products)
        const $featuredGrid = $('#featured-products-grid');
        $featuredGrid.empty();
        const featuredProducts = productsCache.slice(0, 5);

        featuredProducts.forEach(product => {
            const productHtml = `
                <div class="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between">
                    <a href="#product=${product.id}">
                        <img src="${product.image_url}" alt="${product.name}" class="w-full h-40 object-contain mb-4 rounded">
                        <h3 class="font-semibold text-gray-800 h-12 overflow-hidden">${product.name}</h3>
                        <p class="text-lg font-bold text-brand-green mt-2">${product.price.toFixed(2)} TL</p>
                    </a>
                    
                    ${product.quantity > 0
                        ? `<button class="add-to-cart-btn mt-4 w-full bg-brand-gold text-white py-2 rounded-md hover:bg-brand-gold-dark transition-colors" data-product-id="${product.id}">Add to Cart</button>`
                        : `<button class="mt-4 w-full bg-gray-300 text-gray-500 py-2 rounded-md cursor-not-allowed" disabled>Out of Stock</button>`
                    }
                </div>
            `;
            $featuredGrid.append(productHtml);
        });


        showPage('#page-home');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(); // Re-render icons
        }
    }

    /** Renders the Category page */
    function renderCategoryPage(categorySlug) {
        const categoryName = categoryNames[categorySlug] || "Category";
        
        let products;
        if (categorySlug === 'all') {
            products = productsCache; // Get all products
        } else {
            // Find products where category_id (a number) matches the slug (a string)
            products = productsCache.filter(p => p.category_id && p.category_id.toString() === categorySlug);
        }
        
        $('#page-category-title').text(categoryName);
        const $grid = $('#page-category-products-grid');
        $grid.empty(); // Clear old products

        if (products.length === 0) {
            $grid.html('<p class="col-span-full text-center text-gray-600">No products found in this category.</p>');
            return;
        }

        products.forEach(product => {
            const productHtml = `
                <div class="border rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between">
                    <a href="#product=${product.id}">
                        <img src="${product.image_url}" alt="${product.name}" class="w-full h-40 object-contain mb-4 rounded">
                        <h3 class="font-semibold text-gray-800 h-12 overflow-hidden">${product.name}</h3>
                        <p class="text-lg font-bold text-brand-green mt-2">${product.price.toFixed(2)} TL</p>
                    </a>
                    
                    ${product.quantity > 0
                        ? `<button class="add-to-cart-btn mt-4 w-full bg-brand-gold text-white py-2 rounded-md hover:bg-brand-gold-dark transition-colors" data-product-id="${product.id}">Add to Cart</button>`
                        : `<button class="mt-4 w-full bg-gray-300 text-gray-500 py-2 rounded-md cursor-not-allowed" disabled>Out of Stock</button>`
                    }
                </div>
            `;
            $grid.append(productHtml);
        });

        showPage('#page-category');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(); // Re-render icons if any
        }
    }

    /** Renders the Product Detail page */
    function renderProductPage(productId) {
        // Find the product from our cache instead of a new API call
        const product = productsCache.find(p => p.id === parseInt(productId));

        if (!product) {
            console.error("Product not found in cache!");
            renderHomePage(); // Go home if product doesn't exist
            return;
        }

        // Get elements
        const $stockDisplay = $('#product-detail-stock');
        const $quantityInput = $('#product-detail-quantity');
        const $addToCartBtn = $('#product-detail-add-to-cart');

        // Populate the page with product data
        $('#product-detail-image').attr('src', product.image_url).attr('alt', product.name);
        $('#product-detail-name').text(product.name);
        $('#product-detail-price').text(`${product.price.toFixed(2)} TL`);
        $('#product-detail-description').text(product.description);
        $('#product-detail-add-to-cart').data('product-id', product.id); // Set product ID on button

        // --- Handle Stock UI ---
        if (product.quantity > 0) {
            // Product is IN STOCK
            $stockDisplay.text(`Stock: ${product.quantity} available`).removeClass('text-red-600 font-semibold').addClass('text-gray-600');
            $quantityInput.attr('max', product.quantity).val(1).prop('disabled', false);
            $addToCartBtn.prop('disabled', false).html('<i data-lucide="shopping-cart"></i><span>Add to Cart</span>');
        } else {
            // Product is OUT OF STOCK
            $stockDisplay.text('Out of Stock').removeClass('text-gray-600').addClass('text-red-600 font-semibold');
            $quantityInput.val(0).prop('disabled', true);
            $addToCartBtn.prop('disabled', true).html('Out of Stock');
        }
        // --- End Handle Stock UI ---

        showPage('#page-product');
    }

    /** Renders the Cart page */
    function renderCartPage() {
        const cart = getCart();
        const $container = $('#cart-items-container');
        $container.empty();

        if (cart.length === 0) {
            $container.html('<p class="text-center text-gray-600 text-xl">Your cart is empty.</p>');
            $('#cart-summary').addClass('hidden');
            showPage('#page-cart');
            return;
        }
        
        let subtotal = 0;
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            // Find product stock
            const product = productsCache.find(p => p.id === item.id);
            const stock = product ? product.quantity : item.quantity; // Default to item's quantity if product not found

            const itemHtml = `
                <div class="flex items-center justify-between border-b py-4 gap-4">
                    <div class="flex items-center gap-4">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-contain rounded border">
                        <div>
                            <h3 class="font-semibold text-lg">${item.name}</h3>
                            <p class="text-gray-600">${item.price.toFixed(2)} TL</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <input type="number" value="${item.quantity}" min="1" max="${stock}" class="cart-item-quantity w-20 border border-gray-300 rounded-md p-2 text-center" data-product-id="${item.id}">
                        <p class="text-lg font-semibold w-24 text-right">${itemTotal.toFixed(2)} TL</p>
                        <button class="remove-from-cart-btn text-red-600 hover:text-red-800" data-product-id="${item.id}">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            `;
            $container.append(itemHtml);
        });

        $('#cart-total-price').text(`${subtotal.toFixed(2)} TL`);
        $('#cart-summary').removeClass('hidden');

        showPage('#page-cart');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons(); // Re-render trash icons
        }
    }


    // =================================================================
    // ROUTER & EVENT HANDLERS
    // =================================================================

    /** Main router function to handle hash changes */
    function handleHashChange() {
        const hash = window.location.hash;

        if (hash.startsWith('#product=')) {
            const productId = hash.split('=')[1];
            renderProductPage(productId);
        } else if (hash.startsWith('#category=')) {
            const categorySlug = hash.split('=')[1];
            renderCategoryPage(categorySlug);
        } else if (hash === '#cart') {
            renderCartPage();
        } else {
            renderHomePage();
        }
    }

    // --- Main Application Initialization ---
    function initApp() {
        // 1. Show a loading indicator (optional, but good practice)
        $('body').append('<div id="loading-overlay" class="fixed inset-0 bg-white z-[999] flex items-center justify-center"><p class="text-2xl">Loading Pharmacy...</p></div>');

        // 2. Fetch all products from the API
        $.getJSON("/api/products")
            .done(function(data) {
                productsCache = data; // Store in cache
                
                // 3. Once data is loaded, initialize the app
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                updateCartIcon();
                handleHashChange(); // Render the correct page

                // 4. Set up all event listeners
                $(window).on('hashchange', handleHashChange);

                // --- Scroll-to-Top Button ---
                var $scrollToTopBtn = $('#scrollToTopBtn');
                $(window).scroll(function() {
                    if ($(window).scrollTop() > 300) {
                        $scrollToTopBtn.fadeIn();
                    } else {
                        $scrollToTopBtn.fadeOut();
                    }
                });
                $scrollToTopBtn.click(function() {
                    $('html, body').animate({ scrollTop: 0 }, 500);
                    return false;
                });

                // --- Event Delegation for "Add to Cart" ---
                $('body').on('click', '.add-to-cart-btn', function() {
                    const $button = $(this);
                    const productId = $button.data('product-id');
                    let quantity = 1;

                    // Check if we are on the product page to get specific quantity
                    if ($button.attr('id') === 'product-detail-add-to-cart') {
                        quantity = parseInt($('#product-detail-quantity').val()) || 1;
                    }

                    const success = addToCart(productId, quantity);
                    const originalText = $button.html();

                    if (success) {
                        // Show confirmation
                        $button.html('<i data-lucide="check"></i> Added!');
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                        setTimeout(() => {
                            $button.html(originalText);
                            if (originalText.includes('shopping-cart')) {
                                if (typeof lucide !== 'undefined') {
                                    lucide.createIcons();
                                }
                            }
                        }, 1500);
                    } else {
                        // Show error
                        $button.html('Not Enough Stock!');
                        $button.prop('disabled', true); // Temporarily disable
                        setTimeout(() => {
                            $button.html(originalText);
                            $button.prop('disabled', false);
                            if (originalText.includes('shopping-cart')) {
                                if (typeof lucide !== 'undefined') {
                                    lucide.createIcons();
                                }
                            }
                        }, 2000);
                    }
                });

                // --- Event Delegation for "Remove from Cart" ---
                $('body').on('click', '.remove-from-cart-btn', function() {
                    const productId = $(this).data('product-id');
                    removeFromCart(productId);
                    renderCartPage(); // Re-render the cart
                });

                // --- Event Delegation for "Update Quantity" in cart ---
                $('body').on('change', '.cart-item-quantity', function() {
                    const $input = $(this);
                    const productId = $input.data('product-id');
                    let newQuantity = parseInt($input.val());
                    
                    // Check against max stock
                    const product = productsCache.find(p => p.id === productId);
                    if (product && newQuantity > product.quantity) {
                        newQuantity = product.quantity;
                        $input.val(newQuantity); // Correct the input field
                    }
                    
                    updateCartQuantity(productId, newQuantity);
                    renderCartPage(); // Re-render the cart
                });

            })
            .fail(function() {
                console.error("Failed to load products from /api/products.");
                $('body').html('<h1 class="text-center text-red-500 p-10">Error: Could not load product data. Please try again later.</h1>');
            })
            .always(function() {
                // 5. Remove loading indicator
                $('#loading-overlay').fadeOut(300, function() { $(this).remove(); });
            });
    }

    initApp(); // Run the app
});