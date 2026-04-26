// =====================================================
// CineVault - NoSQL-Based Movie Database
// Simulates MongoDB operations with localStorage
// Features: Search, Filter, Sort, Reviews, Schema Panel
// =====================================================

(function () {
    'use strict';

    // ===== STORAGE =====
    const Storage = {
        get(key, fallback = null) {
            try {
                const d = localStorage.getItem(key);
                return d ? JSON.parse(d) : fallback;
            } catch { return fallback; }
        },
        set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
    };

    // ===== MOVIE SEED DATA (simulated MongoDB documents) =====
    const SEED_MOVIES = [
        {
            _id: "m001",
            title: "The Dark Knight",
            year: 2008,
            genre: ["Action", "Drama", "Thriller"],
            director: "Christopher Nolan",
            cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Gary Oldman"],
            plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            rating: 9.0,
            poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
            runtime: 152,
            reviews: [
                { userId: "u1", username: "MovieCritic42", rating: 9.5, comment: "A masterpiece of modern cinema. Heath Ledger's Joker is unforgettable.", createdAt: "2024-03-15" },
                { userId: "u2", username: "FilmBuff99", rating: 9.0, comment: "Christopher Nolan at his finest. Every scene is perfectly crafted.", createdAt: "2024-04-01" }
            ]
        },
        {
            _id: "m002",
            title: "Inception",
            year: 2010,
            genre: ["Sci-Fi", "Action", "Thriller"],
            director: "Christopher Nolan",
            cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy"],
            plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            rating: 8.8,
            poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
            runtime: 148,
            reviews: [
                { userId: "u3", username: "DreamWatcher", rating: 9.0, comment: "Mind-bending and visually stunning. A film that demands multiple viewings.", createdAt: "2024-02-20" }
            ]
        },
        {
            _id: "m003",
            title: "Pulp Fiction",
            year: 1994,
            genre: ["Drama", "Comedy"],
            director: "Quentin Tarantino",
            cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis"],
            plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            rating: 8.9,
            poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
            runtime: 154,
            reviews: [
                { userId: "u1", username: "MovieCritic42", rating: 9.0, comment: "Tarantino's magnum opus. Revolutionary storytelling.", createdAt: "2024-01-10" },
                { userId: "u4", username: "CinemaLover", rating: 8.5, comment: "The dialogue is razor sharp. Every character is memorable.", createdAt: "2024-03-22" }
            ]
        },
        {
            _id: "m004",
            title: "Interstellar",
            year: 2014,
            genre: ["Sci-Fi", "Drama"],
            director: "Christopher Nolan",
            cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
            plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes increasingly uninhabitable.",
            rating: 8.7,
            poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80",
            runtime: 169,
            reviews: [
                { userId: "u5", username: "SpaceNerd", rating: 9.5, comment: "Emotionally devastating and scientifically ambitious. Hans Zimmer's score is incredible.", createdAt: "2024-04-05" }
            ]
        },
        {
            _id: "m005",
            title: "The Shawshank Redemption",
            year: 1994,
            genre: ["Drama"],
            director: "Frank Darabont",
            cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
            plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
            rating: 9.3,
            poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
            runtime: 142,
            reviews: [
                { userId: "u2", username: "FilmBuff99", rating: 10, comment: "The greatest film ever made. Period.", createdAt: "2024-01-05" },
                { userId: "u3", username: "DreamWatcher", rating: 9.0, comment: "Hope is a powerful thing. This film embodies it perfectly.", createdAt: "2024-02-14" }
            ]
        },
        {
            _id: "m006",
            title: "Spider-Man: Into the Spider-Verse",
            year: 2018,
            genre: ["Animation", "Action", "Comedy"],
            director: "Bob Persichetti, Peter Ramsey",
            cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
            plot: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat.",
            rating: 8.4,
            poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80",
            runtime: 117,
            reviews: [
                { userId: "u6", username: "AnimeFan", rating: 9.0, comment: "The animation style is groundbreaking. A visual feast!", createdAt: "2024-03-01" }
            ]
        },
        {
            _id: "m007",
            title: "Get Out",
            year: 2017,
            genre: ["Horror", "Thriller"],
            director: "Jordan Peele",
            cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford", "Catherine Keener"],
            plot: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
            rating: 7.7,
            poster: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            runtime: 104,
            reviews: [
                { userId: "u4", username: "CinemaLover", rating: 8.0, comment: "Jordan Peele redefines horror with social commentary. Brilliant debut.", createdAt: "2024-02-28" }
            ]
        },
        {
            _id: "m008",
            title: "The Grand Budapest Hotel",
            year: 2014,
            genre: ["Comedy", "Drama"],
            director: "Wes Anderson",
            cast: ["Ralph Fiennes", "F. Murray Abraham", "Tony Revolori", "Saoirse Ronan"],
            plot: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years.",
            rating: 8.1,
            poster: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&q=80",
            runtime: 99,
            reviews: [
                { userId: "u1", username: "MovieCritic42", rating: 8.5, comment: "Visually sumptuous and whimsically charming. Peak Wes Anderson.", createdAt: "2024-04-10" }
            ]
        },
        {
            _id: "m009",
            title: "Parasite",
            year: 2019,
            genre: ["Drama", "Thriller"],
            director: "Bong Joon-ho",
            cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
            plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
            rating: 8.5,
            poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
            runtime: 132,
            reviews: [
                { userId: "u5", username: "SpaceNerd", rating: 9.0, comment: "A genre-defying masterpiece that deserved every award it won.", createdAt: "2024-03-18" },
                { userId: "u6", username: "AnimeFan", rating: 8.5, comment: "Bong Joon-ho crafts a perfect thriller about class warfare.", createdAt: "2024-04-02" }
            ]
        },
        {
            _id: "m010",
            title: "La La Land",
            year: 2016,
            genre: ["Romance", "Drama", "Comedy"],
            director: "Damien Chazelle",
            cast: ["Ryan Gosling", "Emma Stone", "John Legend"],
            plot: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
            rating: 8.0,
            poster: "https://images.unsplash.com/photo-1514533212735-5df27d970db0?w=400&q=80",
            runtime: 128,
            reviews: [
                { userId: "u2", username: "FilmBuff99", rating: 8.0, comment: "A love letter to dreamers and artists. The ending is heartbreaking.", createdAt: "2024-01-25" }
            ]
        },
        {
            _id: "m011",
            title: "Blade Runner 2049",
            year: 2017,
            genre: ["Sci-Fi", "Drama", "Thriller"],
            director: "Denis Villeneuve",
            cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Jared Leto"],
            plot: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
            rating: 8.0,
            poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80",
            runtime: 164,
            reviews: [
                { userId: "u3", username: "DreamWatcher", rating: 8.5, comment: "A worthy sequel. The cinematography by Roger Deakins is breathtaking.", createdAt: "2024-03-30" }
            ]
        },
        {
            _id: "m012",
            title: "Spirited Away",
            year: 2001,
            genre: ["Animation", "Drama"],
            director: "Hayao Miyazaki",
            cast: ["Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"],
            plot: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
            rating: 8.6,
            poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
            runtime: 125,
            reviews: [
                { userId: "u6", username: "AnimeFan", rating: 10, comment: "The greatest animated film ever created. Studio Ghibli's crown jewel.", createdAt: "2024-02-05" }
            ]
        }
    ];

    // ===== STATE =====
    let movies = Storage.get('cv_movies', SEED_MOVIES);
    if (!Storage.get('cv_movies')) Storage.set('cv_movies', SEED_MOVIES);
    let currentView = 'grid';

    // ===== DOM REFS =====
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const searchInput = $('#searchInput');
    const searchClear = $('#searchClear');
    const moviesGrid = $('#moviesGrid');
    const emptyState = $('#emptyState');
    const detailModal = $('#detailModal');
    const resultCount = $('#resultCount');

    // ===== UTILITY =====
    function debounce(fn, delay) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
    }

    function renderStars(rating, outOf = 10) {
        const fiveScale = (rating / outOf) * 5;
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += fiveScale >= i ? '<i class="fas fa-star"></i>' :
                    fiveScale >= i - 0.5 ? '<i class="fas fa-star-half-alt"></i>' :
                    '<i class="far fa-star"></i>';
        }
        return html;
    }

    function showToast(msg, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${msg}`;
        container.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    // ===== FILTERING =====
    function getFilteredMovies() {
        let filtered = [...movies];
        const search = searchInput.value.trim().toLowerCase();
        const genre = $('#genreFilter').value;
        const year = $('#yearFilter').value;
        const minRating = $('#ratingFilter').value;
        const sort = $('#sortFilter').value;

        // Search (simulating MongoDB text search)
        if (search) {
            filtered = filtered.filter(m =>
                m.title.toLowerCase().includes(search) ||
                m.director.toLowerCase().includes(search) ||
                m.genre.some(g => g.toLowerCase().includes(search)) ||
                m.cast.some(c => c.toLowerCase().includes(search)) ||
                m.plot.toLowerCase().includes(search)
            );
        }

        // Genre filter (simulating: db.movies.find({ genre: "Action" }))
        if (genre !== 'all') {
            filtered = filtered.filter(m => m.genre.includes(genre));
        }

        // Year filter (simulating: db.movies.find({ year: { $gte: 2010, $lte: 2019 } }))
        if (year !== 'all') {
            switch (year) {
                case '2020s': filtered = filtered.filter(m => m.year >= 2020); break;
                case '2010s': filtered = filtered.filter(m => m.year >= 2010 && m.year < 2020); break;
                case '2000s': filtered = filtered.filter(m => m.year >= 2000 && m.year < 2010); break;
                case '1990s': filtered = filtered.filter(m => m.year >= 1990 && m.year < 2000); break;
                case 'classic': filtered = filtered.filter(m => m.year < 1990); break;
            }
        }

        // Rating filter (simulating: db.movies.find({ rating: { $gte: 8 } }))
        if (minRating !== 'all') {
            filtered = filtered.filter(m => m.rating >= parseFloat(minRating));
        }

        // Sort (simulating: .sort({ rating: -1 }))
        switch (sort) {
            case 'rating_desc': filtered.sort((a, b) => b.rating - a.rating); break;
            case 'rating_asc': filtered.sort((a, b) => a.rating - b.rating); break;
            case 'year_desc': filtered.sort((a, b) => b.year - a.year); break;
            case 'year_asc': filtered.sort((a, b) => a.year - b.year); break;
            case 'title_asc': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
            case 'title_desc': filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
        }

        return filtered;
    }

    // ===== RENDER =====
    function renderMovies() {
        const filtered = getFilteredMovies();
        resultCount.textContent = `${filtered.length} movie${filtered.length !== 1 ? 's' : ''} found`;

        // Update stats
        $('#totalMovies').innerHTML = `<i class="fas fa-video"></i> <b>${movies.length}</b> Movies`;
        const avgAll = movies.length > 0 ? (movies.reduce((s, m) => s + m.rating, 0) / movies.length).toFixed(1) : 0;
        $('#avgRating').innerHTML = `<i class="fas fa-star"></i> <b>${avgAll}</b> Avg Rating`;

        if (filtered.length === 0) {
            moviesGrid.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        const defaultPoster = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80';

        moviesGrid.innerHTML = filtered.map((m, idx) => `
            <article class="movie-card" data-id="${m._id}" style="animation-delay: ${idx * 0.05}s">
                <img class="movie-poster" src="${m.poster || defaultPoster}" alt="${m.title}" onerror="this.src='${defaultPoster}'" loading="lazy">
                <div class="movie-info">
                    <h3 class="movie-title">${m.title}</h3>
                    <div class="movie-meta">
                        ${m.genre.slice(0, 2).map(g => `<span class="movie-meta-tag">${g}</span>`).join('')}
                    </div>
                    <div class="movie-bottom">
                        <div class="movie-rating">
                            <i class="fas fa-star"></i> ${m.rating.toFixed(1)}
                        </div>
                        <span class="movie-year">${m.year}</span>
                    </div>
                </div>
            </article>
        `).join('');

        // Click to open detail
        $$('.movie-card').forEach(card => {
            card.addEventListener('click', () => openDetail(card.dataset.id));
        });
    }

    // ===== DETAIL MODAL =====
    function openDetail(id) {
        const m = movies.find(mv => mv._id === id);
        if (!m) return;

        const defaultPoster = 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80';

        $('#detailContent').innerHTML = `
            <div class="detail-flex">
                <img class="detail-poster" src="${m.poster || defaultPoster}" alt="${m.title}" onerror="this.src='${defaultPoster}'">
                <div class="detail-info">
                    <h2 class="detail-title">${m.title}</h2>
                    <div class="detail-meta-row">
                        <span class="detail-badge"><i class="far fa-calendar"></i> ${m.year}</span>
                        <span class="detail-badge"><i class="far fa-clock"></i> ${m.runtime} min</span>
                        <span class="detail-badge"><i class="fas fa-film"></i> ${m.director}</span>
                    </div>
                    <div class="detail-meta-row">
                        ${m.genre.map(g => `<span class="detail-badge">${g}</span>`).join('')}
                    </div>
                    <p class="detail-plot">${m.plot}</p>
                    <p class="detail-cast"><strong>Cast:</strong> ${m.cast.join(', ')}</p>
                    <div class="detail-rating-big">
                        <span class="rating-num">${m.rating.toFixed(1)}</span>
                        <span class="rating-stars">${renderStars(m.rating)}</span>
                        <span class="rating-count">(${m.reviews.length} reviews)</span>
                    </div>
                </div>
            </div>

            <div class="reviews-section">
                <h3><i class="fas fa-comments"></i> User Reviews</h3>
                ${m.reviews.map(r => `
                    <div class="review-item">
                        <div class="review-header">
                            <span class="review-user"><i class="fas fa-user-circle"></i> ${r.username}</span>
                            <span class="review-rating">${renderStars(r.rating)} ${r.rating}/10</span>
                        </div>
                        <p class="review-comment">${r.comment}</p>
                        <p class="review-date">${r.createdAt}</p>
                    </div>
                `).join('')}

                <div class="add-review">
                    <h4>Write a Review</h4>
                    <div class="review-stars" data-movie-id="${m._id}">
                        ${[1,2,3,4,5,6,7,8,9,10].map(i => `<i class="far fa-star" data-value="${i}"></i>`).join('')}
                    </div>
                    <input type="text" id="reviewUsername" placeholder="Your name">
                    <textarea id="reviewComment" rows="3" placeholder="Write your review..."></textarea>
                    <button class="btn-submit-review" data-movie-id="${m._id}">Submit Review</button>
                </div>
            </div>
        `;

        // Star hover/click for review
        const reviewStars = detailModal.querySelector('.review-stars');
        let selectedRating = 0;
        const starEls = reviewStars.querySelectorAll('i');

        starEls.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const val = parseInt(star.dataset.value);
                starEls.forEach((s, i) => {
                    s.className = i < val ? 'fas fa-star active' : 'far fa-star';
                });
            });
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.value);
            });
        });
        reviewStars.addEventListener('mouseleave', () => {
            starEls.forEach((s, i) => {
                s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
            });
        });

        // Submit review (simulates db.movies.updateOne with $push)
        detailModal.querySelector('.btn-submit-review').addEventListener('click', () => {
            const username = $('#reviewUsername').value.trim() || 'Anonymous';
            const comment = $('#reviewComment').value.trim();
            if (!comment) return;
            if (selectedRating === 0) { showToast('Please select a rating', 'info'); return; }

            const movie = movies.find(mv => mv._id === id);
            if (movie) {
                movie.reviews.push({
                    userId: 'u_guest',
                    username,
                    rating: selectedRating,
                    comment,
                    createdAt: new Date().toISOString().split('T')[0]
                });
                // Recalculate avg rating
                const allRatings = movie.reviews.map(r => r.rating);
                movie.rating = parseFloat((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1));
                Storage.set('cv_movies', movies);
                showToast('Review submitted successfully!');
                openDetail(id); // Refresh detail
                renderMovies();
            }
        });

        detailModal.classList.add('active');
    }

    // ===== SEARCH CLEAR =====
    searchInput.addEventListener('input', () => {
        searchClear.style.display = searchInput.value ? 'block' : 'none';
    });
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        renderMovies();
    });

    // ===== VIEW TOGGLE =====
    function initViewToggle() {
        $('#gridViewBtn').addEventListener('click', () => {
            currentView = 'grid';
            moviesGrid.classList.remove('list-view');
            $('#gridViewBtn').classList.add('active');
            $('#listViewBtn').classList.remove('active');
        });
        $('#listViewBtn').addEventListener('click', () => {
            currentView = 'list';
            moviesGrid.classList.add('list-view');
            $('#listViewBtn').classList.add('active');
            $('#gridViewBtn').classList.remove('active');
        });
    }

    // ===== MONGO PANEL =====
    function initMongoPanel() {
        $('#mongoToggle').addEventListener('click', () => {
            $('#mongoPanel').classList.toggle('active');
        });
        $('#mongoPanelClose').addEventListener('click', () => {
            $('#mongoPanel').classList.remove('active');
        });
    }

    // ===== INIT =====
    function init() {
        renderMovies();
        initViewToggle();
        initMongoPanel();

        // Filters
        searchInput.addEventListener('input', debounce(renderMovies, 300));
        $('#genreFilter').addEventListener('change', renderMovies);
        $('#yearFilter').addEventListener('change', renderMovies);
        $('#ratingFilter').addEventListener('change', renderMovies);
        $('#sortFilter').addEventListener('change', renderMovies);

        // Reset
        $('#resetFilters').addEventListener('click', () => {
            searchInput.value = '';
            searchClear.style.display = 'none';
            $('#genreFilter').value = 'all';
            $('#yearFilter').value = 'all';
            $('#ratingFilter').value = 'all';
            $('#sortFilter').value = 'rating_desc';
            renderMovies();
        });

        // Close modal
        $('#modalClose').addEventListener('click', () => detailModal.classList.remove('active'));
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) detailModal.classList.remove('active');
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
