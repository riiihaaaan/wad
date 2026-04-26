// =====================================================
// FlavorVerse - Interactive Recipe Sharing Platform
// Features: User Auth, CRUD, Rating, Search & Filtering
// =====================================================

(function () {
    'use strict';

    // ===== LOCAL STORAGE HELPERS =====
    const Storage = {
        get(key, fallback = null) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : fallback;
            } catch { return fallback; }
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        remove(key) {
            localStorage.removeItem(key);
        }
    };

    // ===== DEFAULT SEED DATA =====
    const DEFAULT_RECIPES = [
        {
            id: 'r1',
            name: 'Classic Margherita Pizza',
            category: 'dinner',
            cookTime: 35,
            servings: 4,
            difficulty: 'medium',
            image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
            ingredients: ['2 cups all-purpose flour', '1 cup warm water', '1 tbsp olive oil', '1 tsp yeast', '1 cup tomato sauce', '200g fresh mozzarella', 'Fresh basil leaves', 'Salt to taste'],
            instructions: ['Mix flour, water, yeast, and salt to make dough', 'Let dough rise for 1 hour', 'Roll out dough on floured surface', 'Spread tomato sauce evenly', 'Add sliced mozzarella', 'Bake at 450°F for 12-15 minutes', 'Top with fresh basil and drizzle olive oil'],
            authorId: 'system',
            authorName: 'Chef FlavorVerse',
            ratings: [5, 4, 5, 4, 5],
            createdAt: Date.now() - 86400000
        },
        {
            id: 'r2',
            name: 'Fluffy Blueberry Pancakes',
            category: 'breakfast',
            cookTime: 20,
            servings: 2,
            difficulty: 'easy',
            image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
            ingredients: ['1.5 cups flour', '2 tbsp sugar', '1 egg', '1 cup milk', '2 tbsp melted butter', '1 cup fresh blueberries', '1 tsp baking powder', 'Maple syrup for serving'],
            instructions: ['Whisk flour, sugar, and baking powder', 'In a separate bowl, mix egg, milk, and melted butter', 'Combine wet and dry ingredients gently', 'Fold in blueberries', 'Pour batter onto hot griddle', 'Cook until bubbles form, then flip', 'Serve with maple syrup and extra blueberries'],
            authorId: 'system',
            authorName: 'Chef FlavorVerse',
            ratings: [5, 5, 4, 5],
            createdAt: Date.now() - 172800000
        },
        {
            id: 'r3',
            name: 'Thai Green Curry',
            category: 'dinner',
            cookTime: 40,
            servings: 4,
            difficulty: 'medium',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80',
            ingredients: ['400ml coconut milk', '3 tbsp green curry paste', '500g chicken breast', '1 cup bamboo shoots', '1 bell pepper', 'Thai basil leaves', '2 tbsp fish sauce', '1 tbsp brown sugar'],
            instructions: ['Heat coconut cream in a wok until oil separates', 'Add curry paste and cook for 2 minutes', 'Add sliced chicken and cook through', 'Pour in remaining coconut milk', 'Add bamboo shoots and bell pepper', 'Season with fish sauce and sugar', 'Simmer for 10 minutes and garnish with Thai basil'],
            authorId: 'system',
            authorName: 'Chef FlavorVerse',
            ratings: [4, 5, 4, 4, 5, 5],
            createdAt: Date.now() - 259200000
        },
        {
            id: 'r4',
            name: 'Chocolate Lava Cake',
            category: 'dessert',
            cookTime: 25,
            servings: 2,
            difficulty: 'hard',
            image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80',
            ingredients: ['120g dark chocolate', '100g butter', '2 eggs', '2 egg yolks', '50g sugar', '30g flour', 'Cocoa powder for dusting', 'Vanilla ice cream for serving'],
            instructions: ['Melt chocolate and butter together', 'Whisk eggs, yolks, and sugar until fluffy', 'Fold chocolate mixture into eggs', 'Gently fold in flour', 'Pour into greased ramekins', 'Bake at 425°F for exactly 12 minutes', 'Invert onto plate and serve with ice cream immediately'],
            authorId: 'system',
            authorName: 'Chef FlavorVerse',
            ratings: [5, 5, 5, 4, 5],
            createdAt: Date.now() - 345600000
        },
        {
            id: 'r5',
            name: 'Avocado Toast with Poached Egg',
            category: 'breakfast',
            cookTime: 15,
            servings: 1,
            difficulty: 'easy',
            image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
            ingredients: ['2 slices sourdough bread', '1 ripe avocado', '2 eggs', 'Red pepper flakes', 'Everything bagel seasoning', 'Lemon juice', 'Salt and pepper', 'Microgreens for garnish'],
            instructions: ['Toast sourdough bread until golden', 'Mash avocado with lemon juice, salt, and pepper', 'Bring water to gentle simmer and poach eggs for 3 minutes', 'Spread mashed avocado on toast', 'Top each slice with a poached egg', 'Sprinkle with red pepper flakes and everything seasoning', 'Garnish with microgreens'],
            authorId: 'system',
            authorName: 'Chef FlavorVerse',
            ratings: [4, 4, 5, 4],
            createdAt: Date.now() - 432000000
        },
        {
            id: 'r6',
            name: 'Mango Smoothie Bowl',
            category: 'beverage',
            cookTime: 10,
            servings: 1,
            difficulty: 'easy',
            image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80',
            ingredients: ['2 frozen mangoes', '1 banana', '1/2 cup yogurt', 'Granola', 'Chia seeds', 'Coconut flakes', 'Fresh berries', 'Honey drizzle'],
            instructions: ['Blend frozen mango and banana with yogurt', 'Pour thick smoothie into a bowl', 'Arrange granola on one side', 'Add fresh berries and coconut flakes', 'Sprinkle chia seeds', 'Drizzle with honey and serve immediately'],
            authorId: 'system',
            authorName: 'Chef FlavorVerse',
            ratings: [5, 4, 5],
            createdAt: Date.now() - 518400000
        }
    ];

    // ===== STATE =====
    let currentUser = Storage.get('fv_currentUser');
    let users = Storage.get('fv_users', []);
    let recipes = Storage.get('fv_recipes', DEFAULT_RECIPES);
    let activeCategory = 'all';
    let editingRecipeId = null;

    // If recipes haven't been seeded yet
    if (!Storage.get('fv_recipes')) {
        Storage.set('fv_recipes', DEFAULT_RECIPES);
    }

    // ===== DOM REFS =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const authOverlay = $('#authOverlay');
    const appContainer = $('#appContainer');
    const loginForm = $('#loginForm');
    const registerForm = $('#registerForm');
    const recipesGrid = $('#recipesGrid');
    const emptyState = $('#emptyState');
    const searchInput = $('#searchInput');
    const recipeModal = $('#recipeModal');
    const detailModal = $('#detailModal');
    const recipeForm = $('#recipeForm');
    const toastContainer = $('#toastContainer');

    // ===== TOAST =====
    function showToast(message, type = 'success') {
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-triangle', info: 'fa-info-circle' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${icons[type]}"></i> ${message}`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // ===== AUTH =====
    function initAuth() {
        if (currentUser) {
            showApp();
        } else {
            authOverlay.style.display = 'flex';
            appContainer.style.display = 'none';
        }

        $('#showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        });

        $('#showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = $('#loginEmail').value.trim();
            const password = $('#loginPassword').value;
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                currentUser = user;
                Storage.set('fv_currentUser', user);
                showToast(`Welcome back, ${user.name}!`);
                showApp();
            } else {
                showToast('Invalid email or password', 'error');
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#regName').value.trim();
            const email = $('#regEmail').value.trim();
            const password = $('#regPassword').value;

            if (users.find(u => u.email === email)) {
                showToast('Email already registered', 'error');
                return;
            }

            const newUser = { id: 'u' + Date.now(), name, email, password };
            users.push(newUser);
            Storage.set('fv_users', users);
            currentUser = newUser;
            Storage.set('fv_currentUser', newUser);
            showToast(`Welcome to FlavorVerse, ${name}!`);
            showApp();
        });

        $('#logoutBtn').addEventListener('click', () => {
            currentUser = null;
            Storage.remove('fv_currentUser');
            authOverlay.style.display = 'flex';
            appContainer.style.display = 'none';
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
            showToast('Logged out successfully', 'info');
        });
    }

    function showApp() {
        authOverlay.style.display = 'none';
        appContainer.style.display = 'block';
        $('#userGreeting').textContent = `Hi, ${currentUser.name}`;
        renderRecipes();
    }

    // ===== RENDER RECIPES =====
    function getAvgRating(ratings) {
        if (!ratings || ratings.length === 0) return 0;
        return ratings.reduce((a, b) => a + b, 0) / ratings.length;
    }

    function renderStars(avg) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += avg >= i ? '<i class="fas fa-star"></i>' :
                    avg >= i - 0.5 ? '<i class="fas fa-star-half-alt"></i>' :
                    '<i class="far fa-star"></i>';
        }
        return html;
    }

    function getFilteredRecipes() {
        let filtered = [...recipes];
        const search = searchInput.value.trim().toLowerCase();
        const sort = $('#sortSelect').value;
        const difficulty = $('#difficultyFilter').value;

        // Category filter
        if (activeCategory !== 'all') {
            filtered = filtered.filter(r => r.category === activeCategory);
        }

        // Search filter
        if (search) {
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(search) ||
                r.ingredients.some(ing => ing.toLowerCase().includes(search)) ||
                r.category.toLowerCase().includes(search)
            );
        }

        // Difficulty filter
        if (difficulty !== 'all') {
            filtered = filtered.filter(r => r.difficulty === difficulty);
        }

        // Sort
        switch (sort) {
            case 'newest': filtered.sort((a, b) => b.createdAt - a.createdAt); break;
            case 'oldest': filtered.sort((a, b) => a.createdAt - b.createdAt); break;
            case 'highest': filtered.sort((a, b) => getAvgRating(b.ratings) - getAvgRating(a.ratings)); break;
            case 'quickest': filtered.sort((a, b) => a.cookTime - b.cookTime); break;
        }

        return filtered;
    }

    function renderRecipes() {
        const filtered = getFilteredRecipes();

        if (filtered.length === 0) {
            recipesGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        const defaultImg = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80';

        recipesGrid.innerHTML = filtered.map(r => {
            const avg = getAvgRating(r.ratings);
            const isOwner = currentUser && r.authorId === currentUser.id;
            return `
                <article class="recipe-card" data-id="${r.id}">
                    <img class="recipe-card-img" src="${r.image || defaultImg}" alt="${r.name}" onerror="this.src='${defaultImg}'">
                    <div class="recipe-card-body">
                        <span class="recipe-card-category">${r.category}</span>
                        <h3 class="recipe-card-title">${r.name}</h3>
                        <div class="recipe-card-meta">
                            <span><i class="far fa-clock"></i> ${r.cookTime} min</span>
                            <span><i class="fas fa-utensils"></i> ${r.servings} servings</span>
                            <span><i class="fas fa-signal"></i> ${r.difficulty}</span>
                        </div>
                        <div class="recipe-card-footer">
                            <div class="recipe-rating">
                                <span class="stars">${renderStars(avg)}</span>
                                <span class="count">(${r.ratings.length})</span>
                            </div>
                            <span class="recipe-author">by <strong>${r.authorName}</strong></span>
                        </div>
                        ${isOwner ? `
                        <div class="recipe-card-actions">
                            <button class="card-action-btn edit-btn" data-id="${r.id}"><i class="fas fa-edit"></i> Edit</button>
                            <button class="card-action-btn delete card-delete-btn" data-id="${r.id}"><i class="fas fa-trash"></i> Delete</button>
                        </div>` : ''}
                    </div>
                </article>
            `;
        }).join('');

        // Card click -> detail
        $$('.recipe-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.card-action-btn')) return;
                openDetail(card.dataset.id);
            });
        });

        // Edit buttons
        $$('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditRecipe(btn.dataset.id);
            });
        });

        // Delete buttons
        $$('.card-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteRecipe(btn.dataset.id);
            });
        });
    }

    // ===== RECIPE CRUD =====
    function openAddRecipe() {
        editingRecipeId = null;
        recipeForm.reset();
        $('#recipeEditId').value = '';
        $('#modalTitle').textContent = 'Add New Recipe';
        $('#saveRecipeBtn').textContent = 'Save Recipe';
        recipeModal.classList.add('active');
    }

    function openEditRecipe(id) {
        const r = recipes.find(r => r.id === id);
        if (!r) return;
        editingRecipeId = id;
        $('#recipeName').value = r.name;
        $('#recipeCategory').value = r.category;
        $('#recipeCookTime').value = r.cookTime;
        $('#recipeServings').value = r.servings;
        $('#recipeDifficulty').value = r.difficulty;
        $('#recipeImage').value = r.image || '';
        $('#recipeIngredients').value = r.ingredients.join('\n');
        $('#recipeInstructions').value = r.instructions.join('\n');
        $('#recipeEditId').value = id;
        $('#modalTitle').textContent = 'Edit Recipe';
        $('#saveRecipeBtn').textContent = 'Update Recipe';
        recipeModal.classList.add('active');
    }

    function saveRecipe(e) {
        e.preventDefault();
        const name = $('#recipeName').value.trim();
        const category = $('#recipeCategory').value;
        const cookTime = parseInt($('#recipeCookTime').value);
        const servings = parseInt($('#recipeServings').value);
        const difficulty = $('#recipeDifficulty').value;
        const image = $('#recipeImage').value.trim();
        const ingredients = $('#recipeIngredients').value.split('\n').map(l => l.trim()).filter(Boolean);
        const instructions = $('#recipeInstructions').value.split('\n').map(l => l.trim()).filter(Boolean);

        if (editingRecipeId) {
            const idx = recipes.findIndex(r => r.id === editingRecipeId);
            if (idx !== -1) {
                recipes[idx] = { ...recipes[idx], name, category, cookTime, servings, difficulty, image, ingredients, instructions };
                showToast('Recipe updated successfully!');
            }
        } else {
            const newRecipe = {
                id: 'r' + Date.now(),
                name, category, cookTime, servings, difficulty, image,
                ingredients, instructions,
                authorId: currentUser.id,
                authorName: currentUser.name,
                ratings: [],
                createdAt: Date.now()
            };
            recipes.unshift(newRecipe);
            showToast('Recipe added successfully!');
        }

        Storage.set('fv_recipes', recipes);
        recipeModal.classList.remove('active');
        renderRecipes();
    }

    function deleteRecipe(id) {
        if (!confirm('Are you sure you want to delete this recipe?')) return;
        recipes = recipes.filter(r => r.id !== id);
        Storage.set('fv_recipes', recipes);
        showToast('Recipe deleted', 'info');
        renderRecipes();
    }

    // ===== RECIPE DETAIL =====
    function openDetail(id) {
        const r = recipes.find(r => r.id === id);
        if (!r) return;
        const avg = getAvgRating(r.ratings);
        const defaultImg = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80';

        const userRating = 0; // fresh rating each time

        $('#detailContent').innerHTML = `
            <img class="detail-hero-img" src="${r.image || defaultImg}" alt="${r.name}" onerror="this.src='${defaultImg}'">
            <h2 class="detail-title">${r.name}</h2>
            <div class="detail-meta">
                <span><i class="far fa-clock"></i> ${r.cookTime} min</span>
                <span><i class="fas fa-utensils"></i> ${r.servings} servings</span>
                <span><i class="fas fa-signal"></i> ${capitalize(r.difficulty)}</span>
                <span><i class="fas fa-user"></i> ${r.authorName}</span>
            </div>

            <div class="detail-rating-section">
                <span class="rate-label">Rate this recipe:</span>
                <div class="star-input" data-recipe-id="${r.id}">
                    ${[1,2,3,4,5].map(i => `<i class="far fa-star" data-value="${i}"></i>`).join('')}
                </div>
                <span class="avg-rating">${avg.toFixed(1)} avg (${r.ratings.length} ratings)</span>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-list"></i> Ingredients</h3>
                <ul>${r.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
            </div>

            <div class="detail-section">
                <h3><i class="fas fa-clipboard-list"></i> Instructions</h3>
                <ol>${r.instructions.map(step => `<li>${step}</li>`).join('')}</ol>
            </div>
        `;

        // Star rating interaction
        const starInputEl = detailModal.querySelector('.star-input');
        const stars = starInputEl.querySelectorAll('i');

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.dataset.value);
                stars.forEach((s, i) => {
                    s.className = i < val ? 'fas fa-star active' : 'far fa-star';
                });
            });

            star.addEventListener('click', () => {
                const val = parseInt(star.dataset.value);
                const recipeId = starInputEl.dataset.recipeId;
                const recipe = recipes.find(r => r.id === recipeId);
                if (recipe) {
                    recipe.ratings.push(val);
                    Storage.set('fv_recipes', recipes);
                    const newAvg = getAvgRating(recipe.ratings);
                    detailModal.querySelector('.avg-rating').textContent =
                        `${newAvg.toFixed(1)} avg (${recipe.ratings.length} ratings)`;
                    showToast(`You rated this recipe ${val} star${val > 1 ? 's' : ''}!`);
                    renderRecipes();
                }
            });
        });

        starInputEl.addEventListener('mouseleave', () => {
            stars.forEach(s => s.className = 'far fa-star');
        });

        detailModal.classList.add('active');
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ===== FILTERS & SEARCH =====
    function initFilters() {
        // Category chips
        $$('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                $$('.chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                activeCategory = chip.dataset.category;
                renderRecipes();
            });
        });

        // Search
        searchInput.addEventListener('input', debounce(renderRecipes, 300));

        // Sort & difficulty
        $('#sortSelect').addEventListener('change', renderRecipes);
        $('#difficultyFilter').addEventListener('change', renderRecipes);
    }

    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    // ===== MODAL CONTROLS =====
    function initModals() {
        $('#addRecipeBtn').addEventListener('click', openAddRecipe);
        $('#modalClose').addEventListener('click', () => recipeModal.classList.remove('active'));
        $('#cancelRecipe').addEventListener('click', () => recipeModal.classList.remove('active'));
        $('#detailClose').addEventListener('click', () => detailModal.classList.remove('active'));
        recipeForm.addEventListener('submit', saveRecipe);

        // Close on overlay click
        recipeModal.addEventListener('click', (e) => {
            if (e.target === recipeModal) recipeModal.classList.remove('active');
        });
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) detailModal.classList.remove('active');
        });
    }

    // ===== INIT =====
    function init() {
        initAuth();
        initFilters();
        initModals();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
