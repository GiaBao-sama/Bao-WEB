function validateData(email, password) {
    if (!email.includes('@')) {
        alert("Email không hợp lệ, phải có ký tự '@'!");
        return false;
    }

    return true;
}

const btnSignup = document.getElementById('btn-signup-submit');
if (btnSignup) {
    btnSignup.addEventListener('click', () => {
        const email = document.getElementById('signup-email').value;
        const pass = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (pass !== confirm) {
            alert("mật khẩu chưa khớp");
            return;
        }

        if (validateData(email, pass)) {
            auth.createUserWithEmailAndPassword(email, pass)
                .then((user) => alert("đăng ký thành công "))
                .catch((error) => {
                    if (error.code === 'auth/email-already-in-use') {
                        alert("email trùng lặp.");
                    } else {
                        alert("Lỗi đăng ký: " + error.message);
                    }
                });
        }
    });
}

const btnLogin = document.getElementById('btn-login-submit');
if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        auth.signInWithEmailAndPassword(email, pass)
            .then(() => alert("đăng nhập thành công"))
            .catch((error) => alert("sai tên ng dùng hoặc mật khẩu"));
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart.forEach(item => {
    if (!item.quantity || item.quantity < 1) {
        item.quantity = 1;
    }
});

function getCartTotalQuantity() {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function renderCart() {
    const cartList = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');
    const cartBadge = document.getElementById('cartBadge');

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-center text-muted mt-5">Giỏ hàng của bạn đang trống.</p>';
        totalPriceEl.innerText = '0 VND';
        cartBadge.innerText = '0';
        localStorage.setItem('cart', JSON.stringify(cart));
        return;
    }

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        item.quantity = item.quantity || 1;
        const priceNum = parseInt(item.price.replace(/\D/g, '')) || 0;
        total += priceNum * item.quantity;

        cartList.innerHTML += `
    <div class="cart-item">
        <img src="${item.img}">
        <div class="cart-item-detail">
            <p class="cart-item-name">${item.title}</p>
            <p class="cart-item-price">${item.price}</p>
            <small class="text-muted">Số lượng: ${item.quantity}</small>
        </div>
        <button class="btn btn-sm text-muted" onclick="removeFromCart(${index})">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>`;
    });

    totalPriceEl.innerText = total.toLocaleString('vi-VN') + ' VND';
    cartBadge.innerText = getCartTotalQuantity();
    
    // Cập nhật trạng thái icon giỏ hàng
    const cartBtn = document.getElementById('cartBtn');
    if (cart.length > 0) {
        cartBtn.classList.add('cart-has-items');
    } else {
        cartBtn.classList.remove('cart-has-items');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.title === item.title);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        item.quantity = 1;
        cart.push(item);
    }
    renderCart();
}

// Hàm xóa món hàng
window.removeFromCart = function (index) {
    cart.splice(index, 1);
    renderCart();
};

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
    // click img
    document.querySelectorAll('.card-img-top').forEach(img => {
        img.addEventListener('click', (e) => {
            const card = img.closest('.card');
            const item = {
                title: card.querySelector('.card-title').innerText,
                price: card.querySelector('.text-danger').innerText.split(' ')[0] + ' VND',
                img: img.src
            };
            addToCart(item);
            // Open offcanvas
            const myOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
            myOffcanvas.show();
        });
    });

    // clikc deal
    document.querySelectorAll('.btn-danger').forEach(btn => {
        if (btn.innerText.includes("DEAL")) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const card = this.closest('.card');
                const item = {
                    title: card.querySelector('.card-title').innerText,
                    price: card.querySelector('.text-danger').innerText.split(' ')[0] + ' VND',
                    img: card.querySelector('img').src
                };
                addToCart(item);
                //mo offcvanvas
                const myOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
                myOffcanvas.show();
            });
        }
    });

    // Open cart on cartBtn click
    document.getElementById('cartBtn').addEventListener('click', function (e) {
        e.preventDefault();
        const myOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
        myOffcanvas.show();
    });
});