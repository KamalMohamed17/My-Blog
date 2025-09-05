document.addEventListener('DOMContentLoaded', function() {
    const filterToggle = document.getElementById('filter-toggle');
    const filterList = document.getElementById('filter-list');
    if (filterToggle && filterList) {
        filterToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            filterList.style.display = (filterList.style.display === 'none' || filterList.style.display === '') ? 'flex' : 'none';
        });
        document.addEventListener('click', function(e) {
            if (!filterList.contains(e.target) && !filterToggle.contains(e.target)) {
                filterList.style.display = 'none';
            }
        });
        filterList.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const blogTitle = document.getElementById('blog-title');
    if (blogTitle) {
        blogTitle.addEventListener('click', function() {
            currentCategory = 'all';
            currentPage = 1;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === 'all') btn.classList.add('active');
            });
            renderPosts();
        });
    }
});
function generatePosts(categoryName) {
    const startDate = new Date(2024, 3, 17);
        const descriptionsByCategory = {
            tech: [
                "Building the passion with gaming.",
                "Latest tech gadgets reviewed.",
                "AI is changing everything!",
                "How to start exploring with new tech.",
                "Tech for good: innovations.",
                "The rise of smart devices.",
                "Fun game tech.",
                "Music and gaming best combination.",
                "Women in creating technology.",
                "Music source power.",
                "Medic Tech this year.",
                "Programming tips for beginners."
            ],
            travel: [
                "Relaxing vibes.",
                "A day in nature.",
                "Backpacking adventures.",
                "Traveling on a budget.",
                "An unrealstic experiences.",
                "Relaxing place to visit.",
                "Mountain hiking stories.",
                "Best beaches to vist.",
                "Travel safety tips.",
                "City lights at night.",
                "Solo travel inspiration.",
                "Exploring hidden gems."
            ],
            food: [
                "Sweet desserts to try.",
                "Street food discoveries.",
                "Tasteful Fastfood ideas.",
                "Delicious homemade pizza.",
                "A scnack that can replace lunch.",
                "Quick Desert recipes.",
                "Desert for the family.",
                "Exotic spices explained.",
                "Food lover delights.",
                "Healthy breakfast ideas.",
                "Tasteful tacos best exprince.",
                "Cheese lover recipies."
            ],
            lifestyle: [
                "Morning routines for success.",
                "Minimalist living tips.",
                "Balancing work and life.",
                "Home decor inspiration.",
                "Staying motivated daily.",
                "Fitness at home.",
                "Mindfulness practices.",
                "Fashion trends this season.",
                "Organizing your space.",
                "Self-care essentials.",
                "Productivity hacks.",
                "Healthy habits to start."
            ]
        };
        const accountNames = ["John", "Sarah", "Alex", "Emily", "David", "Sophia", "Michael", "Olivia", "Daniel", "Emma", "James", "Ava"];
        return Array.from({ length: 12 }, (_, i) => {
                const postDate = new Date(startDate);
                postDate.setDate(startDate.getDate() + i);
                const day = String(postDate.getDate()).padStart(2, '0');
                const month = String(postDate.getMonth() + 1).padStart(2, '0');
                const year = postDate.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;
                const folder = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
                const image = `Images/${folder}/${i+1}.jpg`;
                const key = categoryName.toLowerCase();
                return {
                        title: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Blog `,
                        description: descriptionsByCategory[key][i],
                        account: accountNames[i % accountNames.length],
                        date: formattedDate,
                        image,
                };
        });
}

const categories = {
    tech: generatePosts("tech"),
    travel: generatePosts("travel"),
    food: generatePosts("food"),
    lifestyle: generatePosts("lifestyle"),
};

let currentCategory = "all";
let currentPage = 1;
const postsPerPage = 6;

const postsContainer = document.getElementById("posts-container");
const paginationContainer = document.getElementById("pagination");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const filterBtns = document.querySelectorAll(".filter-btn");

function getVisiblePosts() {
    return currentCategory === "all"
        ? Object.values(categories).flat()
        : categories[currentCategory];
}

function renderPosts() {
    const allPosts = getVisiblePosts();
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = allPosts.slice(start, end);

        postsContainer.innerHTML = postsToShow.map(post => `
            <div class="post-card">
                <img class="post-image" src="${post.image}" alt="${post.title}" style="width:100%;height:180px;object-fit:cover;border-radius:12px 12px 0 0;">
                <div class="post-content">
                    <div class="post-title">${post.title}</div>
                    <div class="post-description">${post.description}</div>
                    <div class="post-bottom-row">
                        <div class="post-account"><span class="avatar-circle"><i data-lucide="user"></i></span> <span class="account-name">${post.account}</span></div>
                        <div class="post-footer-date">${post.date}</div>
                    </div>
                </div>
            </div>
        `).join("");
    if (window.lucide) {
      lucide.createIcons();
    }

    renderPaginationDots(allPosts.length);
    updateArrowButtons(allPosts.length);
}

function renderPaginationDots(totalPosts) {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const dot = document.createElement("span");
        dot.classList.add("page-dot");
        if (i === currentPage) dot.classList.add("active");

        dot.addEventListener("click", () => {
            currentPage = i;
            renderPosts();
        });

        paginationContainer.appendChild(dot);
    }
}

function updateArrowButtons(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        currentPage = 1;
        // If search bar is not empty, trigger search logic
        if (searchBar && searchBar.value.trim()) {
            searchBar.dispatchEvent(new Event('input'));
        } else {
            paginationContainer.style.display = '';
            renderPosts();
        }
    });
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPosts();
    }
});

nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(getVisiblePosts().length / postsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPosts();
    }
});


const searchBar = document.getElementById('search-bar');
if (searchBar) {
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.trim();
        if (!query) {
            paginationContainer.style.display = '';
            renderPosts();
            return;
        }
    const dateRegex = /^(\d{1,2})\/(\d{1,2})$/;
        let match = query.match(dateRegex);
        let filteredPosts = getVisiblePosts();
        if (match) {
            let [_, d, m] = match;
            d = d.padStart(2, '0');
            m = m.padStart(2, '0');
            filteredPosts = filteredPosts.filter(post => {
                const [pd, pm] = post.date.split('/');
                return pd === d && pm.startsWith(m);
            });
        }
        postsContainer.innerHTML = filteredPosts.map(post => `
            <div class="post-card">
                <img class="post-image" src="${post.image}" alt="${post.title}" style="width:100%;height:180px;object-fit:cover;border-radius:12px 12px 0 0;">
                <div class="post-content">
                    <div class="post-title">${post.title}</div>
                    <div class="post-description">${post.description}</div>
                    <div class="post-account"><span class="avatar-circle"><i data-lucide="user"></i></span> <span class="account-name">${post.account}</span></div>
                </div>
                <div class="post-footer">${post.date}</div>
            </div>
        `).join("");
            postsContainer.innerHTML = filteredPosts.map(post => `
                <div class="post-card">
                    <img class="post-image" src="${post.image}" alt="${post.title}" style="width:100%;height:180px;object-fit:cover;border-radius:12px 12px 0 0;">
                    <div class="post-content">
                        <div class="post-title">${post.title}</div>
                        <div class="post-description">${post.description}</div>
                        <div class="post-author-bottom">
                          <div class="post-account"><span class="avatar-circle"><i data-lucide="user"></i></span> <span class="account-name">${post.account}</span></div>
                        </div>
                        <div class="post-footer">${post.date}</div>
                    </div>
                </div>
            `).join("");
        if (window.lucide) {
          lucide.createIcons();
        }
        paginationContainer.style.display = '';
    });
}

renderPosts();

// --- Search Bar Toggle Logic ---
window.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('search-toggle');
    const searchBar = document.getElementById('search-bar');
    if (searchToggle && searchBar) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            searchBar.classList.add('open');
            searchToggle.style.display = 'none';
            searchBar.focus();
        });
        document.addEventListener('click', function(e) {
            if (!searchBar.contains(e.target)) {
                searchBar.classList.remove('open');
                searchToggle.style.display = '';
            }
        });
        searchBar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});