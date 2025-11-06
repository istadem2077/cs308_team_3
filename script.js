$(document).ready(function() {
    
    // =================================================================
    // MOCK DATABASE
    // =================================================================
    const allProducts = [
        { id: 1, name: 'Vitamin C 1000mg', price: 199.90, image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Vitamin+C', category: 'vitamins', description: 'High-potency Vitamin C for daily immune support and antioxidant protection.' },
        { id: 2, name: 'Omega 3 Fish Oil', price: 450.50, image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Fish+Oil', category: 'fish-oils', description: 'Purified fish oil capsules, rich in EPA and DHA to support heart and brain health.' },
        { id: 3, name: 'Vitamin D3+K2', price: 320.00, category: 'vitamins', image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Vitamin+D', description: 'Essential vitamins for bone health, calcium absorption, and cardiovascular support.' },
        { id: 4, name: 'Nutraxin Multivitamin', price: 315.00, category: 'minerals', image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Multivitamin', description: 'A comprehensive blend of essential vitamins and minerals for men.' },
        { id: 5, name: 'Probiotic 10 Billion', price: 299.00, category: 'new-products', image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Probiotic', description: 'Supports digestive health and a balanced gut microbiome with 10 billion active cultures.' },
        { id: 6, name: 'Solgar Vitamin B12', price: 275.00, category: 'vitamins', image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Vitamin+B12', description: 'High-quality Vitamin B12 for energy metabolism and nervous system health.' },
        { id: 7, name: 'Nordic Naturals Cod Liver Oil', price: 550.00, category: 'fish-oils', image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Cod+Liver+Oil', description: 'Premium cod liver oil, a great source of Vitamins A and D.' },
        { id: 8, name: 'Magnesium Glycinate', price: 380.00, category: 'minerals', image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Magnesium', description: 'Highly absorbable magnesium for muscle relaxation, sleep, and stress relief.' },
        { id: 9, name: 'Collagen Peptides', price: 620.00, category: 'new-products', image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Collagen', description: 'Supports healthy skin, hair, nails, and joints. Unflavored and easily dissolvable.' },
        { id: 10, name: 'Special Discount Vitamin Pack', price: 400.00, image: 'https://placehold.co/200x200/F5F5F5/AAA?text=Discount+Pack', category: 'discounted-products', description: 'A limited-time offer pack containing Vitamin C, D, and Zinc.' },
    ];

    const categoryNames = {
        'vitamins': 'Vitamins',
        'fish-oils': 'Fish Oils',
        'minerals': 'Minerals',
        'new-products': 'New Products',
        'discounted-products': 'Discounted Products',
        'all': 'All Products' // Added this line
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
        const product = allProducts.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found!');
            return;
        }

        if (existingItemIndex > -1) {
            // Update quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        saveCart(cart);
    }

    /** Removes an item from the cart */
    function removeFromCart(productId) {
        let cart = getCart().filter(item => item.id !== productId);
        saveCart(cart);
    }

    /** Updates the quantity of a cart item */
    function updateCartQuantity(productId, newQuantity) {
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

    /** Renders the Home page */
    function renderHomePage() {
        showPage('#page-home');
    }

    /** Renders the Category page */
    function renderCategoryPage(categorySlug) {
        const categoryName = categoryNames[categorySlug] || "Category";
        
        let products;
        if (categorySlug === 'all') {
            products = allProducts; // Get all products
        } else {
            products = allProducts.filter(p => p.category === categorySlug); // Get filtered products
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
                        <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-contain mb-4 rounded">
                        <h3 class="font-semibold text-gray-800 h-12 overflow-hidden">${product.name}</h3>
                        <p class="text-lg font-bold text-brand-green mt-2">${product.price.toFixed(2)} TL</p>
                    </a>
                    <button class="add-to-cart-btn mt-4 w-full bg-brand-gold text-white py-2 rounded-md hover:bg-brand-gold-dark transition-colors" data-product-id="${product.id}">Add to Cart</button>
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
        const product = allProducts.find(p => p.id === parseInt(productId));

        if (!product) {
            renderHomePage(); // Or show a 404 page
            return;
        }

        $('#product-detail-image').attr('src', product.image).attr('alt', product.name);
        $('#product-detail-name').text(product.name);
        $('#product-detail-price').text(`${product.price.toFixed(2)} TL`);
        $('#product-detail-description').text(product.description);
        $('#product-detail-quantity').val(1); // Reset quantity to 1
        $('#product-detail-add-to-cart').data('product-id', product.id); // Set product ID on button

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
                        <input type="number" value="${item.quantity}" min="1" class="cart-item-quantity w-20 border border-gray-300 rounded-md p-2 text-center" data-product-id="${item.id}">
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

    // --- Initial Page Load ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    updateCartIcon();
    handleHashChange(); // Render correct page on load

    // --- Listen for Hash Changes ---
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

        addToCart(productId, quantity);

        // Show confirmation
        const originalText = $button.html();
        $button.html('<i data-lucide="check"></i> Added!');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        setTimeout(() => {
            $button.html(originalText);
            // Re-render original icon if it had one
            if (originalText.includes('shopping-cart')) {
                 if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                 }
            }
        }, 1500);
    });

    // --- Event Delegation for "Remove from Cart" ---
    $('body').on('click', '.remove-from-cart-btn', function() {
        const productId = $(this).data('product-id');
        removeFromCart(productId);
        renderCartPage(); // Re-render the cart
    });

    // --- Event Delegation for "Update Quantity" in cart ---
    $('body').on('change', '.cart-item-quantity', function() {
        const productId = $(this).data('product-id');
        const newQuantity = parseInt($(this).val());
        updateCartQuantity(productId, newQuantity);
        renderCartPage(); // Re-render the cart
    });
});