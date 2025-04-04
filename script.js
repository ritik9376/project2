        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const mainNav = document.getElementById('main-nav');
        
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
        
        // Cart functionality
        let cartItems = [];
        let purchaseHistory = [];
        
        // DOM elements
        const cartModal = document.getElementById('cart-modal');
        const historyModal = document.getElementById('history-modal');
        const cartIcon = document.getElementById('cart-icon');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const cartCountDisplay = document.getElementById('cart-count');
        const checkoutBtn = document.getElementById('checkout-btn');
        const purchaseHistoryContainer = document.getElementById('purchase-history');
        
        // Add to cart functionality
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const product = this.parentElement;
                const title = product.querySelector('h3').textContent;
                const price = parseFloat(this.getAttribute('data-price'));
                const image = product.querySelector('img').src;
                
                // Check if item already exists in cart
                const existingItemIndex = cartItems.findIndex(item => item.title === title);
                
                if (existingItemIndex !== -1) {
                    // Item exists, increase quantity
                    cartItems[existingItemIndex].quantity++;
                } else {
                    // Add new item to cart
                    cartItems.push({
                        title,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                // Update cart count
                updateCartCount();
                
                // Show notification
                const notification = document.createElement('div');
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.right = '20px';
                notification.style.backgroundColor = '#3498db';
                notification.style.color = 'white';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '4px';
                notification.style.zIndex = '1000';
                notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                notification.textContent = `${title} added to cart!`;
                document.body.appendChild(notification);
                
                // Remove notification after 3 seconds
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
            });
        });
        
        // Gift card purchase functionality
        document.querySelectorAll('.gift-card-btn').forEach(button => {
            button.addEventListener('click', function() {
                const giftCard = this.parentElement.parentElement;
                const title = giftCard.querySelector('h3').textContent;
                const priceText = giftCard.querySelector('.gift-card-price').textContent;
                const price = parseFloat(priceText.replace('₹', ''));
                const image = giftCard.querySelector('img').src;
                
                // Add gift card to cart
                cartItems.push({
                    title,
                    price,
                    image,
                    quantity: 1
                });
                
                // Update cart count
                updateCartCount();
                
                // Show notification
                alert(`${title} has been added to your cart.`);
            });
        });
        
        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                
                // Here you would typically send the form data to a server
                // For now, we'll just show an alert
                alert(`Thank you for your message, ${name}! We will get back to you soon.`);
                contactForm.reset();
            });
        }
        
        // Update cart count
        function updateCartCount() {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            cartCountDisplay.textContent = totalItems;
        }
        
        // Open cart modal
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            updateCartDisplay();
            cartModal.style.display = 'block';
        });
        
        // Close modals when clicking on X
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', function() {
                cartModal.style.display = 'none';
                historyModal.style.display = 'none';
            });
        });
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
            }
            if (event.target === historyModal) {
                historyModal.style.display = 'none';
            }
        });
        
        // Update cart display
        function updateCartDisplay() {
            cartItemsContainer.innerHTML = '';
            let total = 0;
            
            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                cartTotalAmount.textContent = '₹0.00';
                return;
            }
            
            cartItems.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                        <div>
                            <h4>${item.title}</h4>
                            <p>₹${item.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                    </div>
                    <div>
                        <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            cartTotalAmount.textContent = `₹${total.toFixed(2)}`;
            
            // Add event listeners to quantity and remove buttons
            document.querySelectorAll('.quantity-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    const action = this.getAttribute('data-action');
                    
                    if (action === 'increase') {
                        cartItems[index].quantity++;
                    } else if (action === 'decrease') {
                        if (cartItems[index].quantity > 1) {
                            cartItems[index].quantity--;
                        }
                    }
                    
                    updateCartDisplay();
                    updateCartCount();
                });
            });
            
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    cartItems.splice(index, 1);
                    updateCartDisplay();
                    updateCartCount();
                });
            });
        }
        
        // Checkout functionality
        checkoutBtn.addEventListener('click', function() {
            if (cartItems.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const date = new Date().toLocaleDateString();
            
            // Add to purchase history
            purchaseHistory.push({
                items: [...cartItems],
                total,
                date
            });
            
            // Save to localStorage
            localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
            
            // Clear cart
            cartItems = [];
            updateCartCount();
            updateCartDisplay();
            
            // Show confirmation
            alert(`Thank you for your purchase! Total: ₹${total.toFixed(2)}`);
            
            // Show purchase history
            updatePurchaseHistoryDisplay();
            cartModal.style.display = 'none';
            historyModal.style.display = 'block';
        });
        
        // Update purchase history display
        function updatePurchaseHistoryDisplay() {
            purchaseHistoryContainer.innerHTML = '';
            
            if (purchaseHistory.length === 0) {
                purchaseHistoryContainer.innerHTML = '<p>You have no purchase history.</p>';
                return;
            }
            
            purchaseHistory.forEach((purchase, index) => {
                const purchaseElement = document.createElement('div');
                purchaseElement.className = 'purchase-record';
                purchaseElement.innerHTML = `
                    <h3>Purchase #${index + 1} - ${purchase.date}</h3>
                    <div class="purchase-items">
                        ${purchase.items.map(item => `
                            <div class="purchase-item">
                                <img src="${item.image}" alt="${item.title}" style="width: 30px; height: 30px; object-fit: cover; margin-right: 5px;">
                                ${item.title} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}
                            </div>
                        `).join('')}
                    </div>
                    <div class="purchase-total">
                        <p><strong>Total: ₹${purchase.total.toFixed(2)}</strong></p>
                    </div>
                    <hr>
                `;
                
                purchaseHistoryContainer.appendChild(purchaseElement);
            });
        }
        
        // Load purchase history from localStorage
        window.addEventListener('DOMContentLoaded', function() {
            const savedHistory = localStorage.getItem('purchaseHistory');
            if (savedHistory) {
                purchaseHistory = JSON.parse(savedHistory);
            }
            
            // Add "View Purchase History" link
            const loginSignup = document.querySelector('.login-signup');
            const historyLink = document.createElement('a');
            historyLink.href = '#';
            historyLink.innerHTML = ' | <i class="fas fa-history"></i> History';
            historyLink.addEventListener('click', function(e) {
                e.preventDefault();
                updatePurchaseHistoryDisplay();
                historyModal.style.display = 'block';
            });
            loginSignup.appendChild(historyLink);
        });
        
        // Genre filtering
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const genre = this.getAttribute('data-genre');
                
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Filter products
                const products = document.querySelectorAll('.product');
                products.forEach(product => {
                    if (genre === 'all' || product.getAttribute('data-genre') === genre) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
        
        // Search functionality
        function searchProducts() {
            const input = document.querySelector('.search-bar');
            const products = document.querySelectorAll('.product');
            const searchQuery = input.value.toLowerCase();
            
            products.forEach(product => {
                const productName = product.querySelector('h3').textContent.toLowerCase();
                const productDescription = product.querySelector('p').textContent.toLowerCase();
                const productGenre = product.getAttribute('data-genre').toLowerCase();
                
                if (productName.includes(searchQuery) || 
                    productDescription.includes(searchQuery) ||
                    productGenre.includes(searchQuery)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        }
        
        // Attach search functionality to the search bar
        document.querySelector('.search-bar').addEventListener('input', searchProducts);
        
        // Security features (from original code)
        
        
        document.addEventListener("contextmenu", function(event){
            event.preventDefault();
            alert('Right Click is Disabled');
        }, false);




document.addEventListener('copy', function(e){
            e.preventDefault();
            const customMessage = "have nice day";
            e.clipboardData.setData('text/plain', customMessage);
        });
    

        
