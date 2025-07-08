// GitHub API configuration
const GITHUB_USERNAME = 'LeKyuFr';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
const GITHUB_USER_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

// Language colors for project cards
const languageColors = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3776ab',
    'Java': '#b07219',
    'C#': '#239120',
    'C++': '#f34b7d',
    'C': '#555555',
    'PHP': '#777bb4',
    'Ruby': '#701516',
    'Go': '#00add8',
    'Rust': '#dea584',
    'Swift': '#fa7343',
    'Kotlin': '#a97bff',
    'Dart': '#00b4ab',
    'HTML': '#e34c26',
    'CSS': '#1572b6',
    'Vue': '#4fc08d',
    'React': '#61dafb',
    'Angular': '#dd0031',
    'Node.js': '#68a063',
    'Express': '#000000',
    'MongoDB': '#47a248',
    'MySQL': '#4479a1',
    'PostgreSQL': '#336791',
    'Docker': '#2496ed',
    'Kubernetes': '#326ce5'
};

// Project icons based on keywords in name/description
const getProjectIcon = (name, description, language) => {
    const text = (name + ' ' + (description || '')).toLowerCase();
    
    if (text.includes('bot') || text.includes('discord')) return 'fas fa-robot';
    if (text.includes('web') || text.includes('site')) return 'fas fa-globe';
    if (text.includes('api') || text.includes('backend')) return 'fas fa-server';
    if (text.includes('mobile') || text.includes('android') || text.includes('ios')) return 'fas fa-mobile-alt';
    if (text.includes('game') || text.includes('jeu')) return 'fas fa-gamepad';
    if (text.includes('dashboard') || text.includes('admin')) return 'fas fa-chart-line';
    if (text.includes('blog') || text.includes('cms')) return 'fas fa-blog';
    if (text.includes('ecommerce') || text.includes('shop')) return 'fas fa-shopping-cart';
    if (text.includes('chat') || text.includes('message')) return 'fas fa-comments';
    if (text.includes('tool') || text.includes('utility')) return 'fas fa-tools';
    if (text.includes('library') || text.includes('package')) return 'fas fa-box';
    
    // Default icons based on language
    if (language === 'Python') return 'fab fa-python';
    if (language === 'JavaScript' || language === 'TypeScript') return 'fab fa-js-square';
    if (language === 'Java') return 'fab fa-java';
    if (language === 'PHP') return 'fab fa-php';
    if (language === 'C#') return 'fas fa-code';
    
    return 'fas fa-code';
};

// Get project category based on language and description
const getProjectCategory = (language, description, topics) => {
    const text = (description || '').toLowerCase();
    const allTopics = topics ? topics.join(' ').toLowerCase() : '';
    const name = (description || '').toLowerCase();
    
    if (text.includes('web') || allTopics.includes('web') || text.includes('website')) return { name: 'Web', color: 'bg-blue-500' };
    if (text.includes('mobile') || allTopics.includes('mobile')) return { name: 'Mobile', color: 'bg-green-500' };
    if (text.includes('api') || allTopics.includes('api') || text.includes('backend')) return { name: 'API', color: 'bg-purple-500' };
    if (text.includes('bot') || allTopics.includes('bot') || text.includes('discord')) return { name: 'Bot', color: 'bg-red-500' };
    if (text.includes('game') || allTopics.includes('game') || text.includes('jeu')) return { name: 'Game', color: 'bg-yellow-500' };
    if (text.includes('tool') || allTopics.includes('tool') || text.includes('utility')) return { name: 'Tool', color: 'bg-cyan-500' };
    if (allTopics.includes('library') || text.includes('library')) return { name: 'Library', color: 'bg-pink-500' };
    if (text.includes('dashboard') || text.includes('admin')) return { name: 'Dashboard', color: 'bg-indigo-500' };
    
    // Default based on language
    if (language === 'Python') return { name: 'Python', color: 'bg-yellow-600' };
    if (language === 'JavaScript' || language === 'TypeScript') return { name: 'JavaScript', color: 'bg-yellow-500' };
    if (language === 'Java') return { name: 'Java', color: 'bg-orange-500' };
    if (language === 'PHP') return { name: 'PHP', color: 'bg-purple-600' };
    if (language === 'HTML') return { name: 'Web', color: 'bg-blue-500' };
    if (language === 'CSS') return { name: 'Web', color: 'bg-blue-500' };
    if (language === 'C#') return { name: 'C#', color: 'bg-green-600' };
    if (language === 'C++') return { name: 'C++', color: 'bg-blue-600' };
    
    return { name: 'Project', color: 'bg-gray-500' };
};

// Fetch GitHub user profile
async function fetchGitHubProfile() {
    try {
        const response = await fetch(GITHUB_USER_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const user = await response.json();
        
        // Update profile image in about section
        const profileImage = document.querySelector('#about .w-32.h-32');
        if (profileImage && user.avatar_url) {
            // Add loading effect
            profileImage.innerHTML = `
                <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 relative">
                    <img src="${user.avatar_url}" alt="Photo de profil LeKyuFr" 
                         class="w-full h-full object-cover transition-opacity duration-500 opacity-0"
                         onload="this.style.opacity='1'"
                         onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full bg-primary flex items-center justify-center\\'>
                         <i class=\\'fas fa-code text-4xl text-white\\'></i></div>'">
                    <div class="absolute inset-0 bg-primary/20 animate-pulse"></div>
                </div>
            `;
            profileImage.classList.remove('bg-primary', 'flex', 'items-center', 'justify-center');
        }
        
        // Update name and title with GitHub data
        const nameElement = profileImage?.parentElement?.querySelector('.text-lg.font-semibold');
        const titleElement = profileImage?.parentElement?.querySelector('.text-slate-400');
        
        if (nameElement && user.name) {
            nameElement.textContent = user.name;
        }
        
        if (titleElement && user.bio) {
            titleElement.textContent = user.bio;
        }
        
        // Update location if available
        if (user.location) {
            const locationDiv = document.createElement('p');
            locationDiv.className = 'text-slate-500 text-sm mt-2';
            locationDiv.innerHTML = `<i class="fas fa-map-marker-alt mr-1"></i>${user.location}`;
            titleElement?.parentElement?.appendChild(locationDiv);
        }
        
        // Update main bio section with more detailed info
        const bioElements = document.querySelectorAll('#about .text-slate-300');
        if (bioElements.length > 0 && user.bio) {
            bioElements[0].innerHTML = `
                ${user.bio}<br><br>
                Depuis ${new Date(user.created_at).getFullYear()}, je contribue activement 
                à la communauté open source avec ${user.public_repos} repositories publics.
            `;
        }
        
        // Update follower/following stats
        const statsContainer = document.querySelector('#about .grid.grid-cols-2');
        if (statsContainer && user.public_repos) {
            // Add GitHub stats card
            const statsCard = document.createElement('div');
            statsCard.className = 'bg-slate-700 p-4 rounded-lg md:col-span-2';
            statsCard.innerHTML = `
                <i class="fab fa-github text-primary text-2xl mb-2"></i>
                <h4 class="font-semibold mb-1">GitHub Stats</h4>
                <div class="grid grid-cols-3 gap-4 text-sm text-slate-400">
                    <div class="text-center">
                        <div class="font-bold text-white">${user.public_repos}</div>
                        <div>Repos</div>
                    </div>
                    <div class="text-center">
                        <div class="font-bold text-white">${user.followers}</div>
                        <div>Followers</div>
                    </div>
                    <div class="text-center">
                        <div class="font-bold text-white">${user.following}</div>
                        <div>Following</div>
                    </div>
                </div>
            `;
            statsContainer.appendChild(statsCard);
        }
        
        console.log('GitHub profile loaded successfully');
        
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        // Keep default avatar if API fails
        const profileImage = document.querySelector('#about .w-32.h-32');
        if (profileImage) {
            profileImage.innerHTML = `
                <div class="w-32 h-32 bg-primary rounded-full flex items-center justify-center border-4 border-primary/30">
                    <i class="fas fa-code text-4xl text-white"></i>
                </div>
            `;
        }
    }
}

// Fetch GitHub repositories
async function fetchGitHubProjects() {
    const loadingElement = document.getElementById('projects-loading');
    const containerElement = document.getElementById('projects-container');
    const errorElement = document.getElementById('projects-error');
    
    try {
        loadingElement.classList.remove('hidden');
        containerElement.classList.add('hidden');
        errorElement.classList.add('hidden');
        
        const response = await fetch(`${GITHUB_API_URL}?sort=updated&per_page=12`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const repos = await response.json();
        
        console.log(`Fetched ${repos.length} repositories from GitHub`);
        
        // Filter out forked repos and private repos, but keep repos even without description
        const filteredRepos = repos.filter(repo => 
            !repo.fork && 
            !repo.private &&
            repo.name !== GITHUB_USERNAME && // Exclude profile README repo
            repo.name !== 'lekyufr.github.io' // Exclude GitHub Pages repo (optional)
        ).slice(0, 9); // Limit to 9 projects for nice grid
        
        console.log(`Filtered to ${filteredRepos.length} repositories`, filteredRepos.map(r => r.name));
        
        if (filteredRepos.length === 0) {
            // Show all repos if filtering is too strict
            const allPublicRepos = repos.filter(repo => !repo.private).slice(0, 6);
            if (allPublicRepos.length > 0) {
                displayProjects(allPublicRepos);
                loadingElement.classList.add('hidden');
                containerElement.classList.remove('hidden');
                return;
            }
            throw new Error('Aucun projet trouvé');
        }
        
        displayProjects(filteredRepos);
        
        loadingElement.classList.add('hidden');
        containerElement.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
    }
}

// Display projects in the container
function displayProjects(repos) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    
    repos.forEach(repo => {
        const category = getProjectCategory(repo.language, repo.description, repo.topics);
        const icon = getProjectIcon(repo.name, repo.description, repo.language);
        const languageColor = languageColors[repo.language] || '#6b7280';
        
        // Format date
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short'
        });
        
        // Create gradient based on language color
        const gradientStyle = `background: linear-gradient(135deg, ${languageColor}30, ${languageColor}20)`;
        
        const projectCard = document.createElement('div');
        projectCard.className = 'bg-slate-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group project-card';
        
        projectCard.innerHTML = `
            <div class="h-48 relative overflow-hidden" style="${gradientStyle}">
                <div class="absolute inset-0 flex items-center justify-center">
                    <i class="${icon} text-6xl text-white/80 project-icon"></i>
                </div>
                <div class="absolute top-4 right-4">
                    <span class="${category.color} px-3 py-1 rounded-full text-sm text-white">${category.name}</span>
                </div>
                <div class="absolute bottom-4 left-4">
                    <div class="flex items-center text-white/70 text-sm">
                        <i class="fas fa-star mr-1"></i>
                        <span>${repo.stargazers_count}</span>
                        <i class="fas fa-code-branch ml-3 mr-1"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-3">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                <p class="text-slate-400 mb-4 line-clamp-3">
                    ${repo.description || `Projet ${repo.language || 'de développement'} - Consultez le repository pour plus d'informations.`}
                </p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${repo.language ? `<span class="bg-slate-700 px-2 py-1 rounded text-sm flex items-center">
                        <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${languageColor}"></div>
                        ${repo.language}
                    </span>` : ''}
                    ${repo.topics && repo.topics.length > 0 ? 
                        repo.topics.slice(0, 2).map(topic => 
                            `<span class="bg-slate-700 px-2 py-1 rounded text-sm">${topic}</span>`
                        ).join('') : ''
                    }
                    ${repo.size > 0 ? `<span class="bg-slate-600 px-2 py-1 rounded text-sm">${(repo.size / 1024).toFixed(1)} MB</span>` : ''}
                </div>
                <div class="flex justify-between items-center">
                    <div class="flex gap-3">
                        ${repo.homepage ? 
                            `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors project-link">
                                <i class="fas fa-external-link-alt"></i> Demo
                            </a>` : ''
                        }
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-secondary transition-colors project-link">
                            <i class="fab fa-github"></i> Code
                        </a>
                    </div>
                    <span class="text-slate-500 text-sm">${updatedDate}</span>
                </div>
            </div>
        `;
        
        container.appendChild(projectCard);
    });
    
    // Re-apply project card effects
    applyProjectEffects();
}

// Apply hover effects to project cards
function applyProjectEffects() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = -(x - centerX) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
        }
    });
});

// Scroll to top button
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.remove('opacity-0', 'invisible');
        scrollTopBtn.classList.add('opacity-100', 'visible');
    } else {
        scrollTopBtn.classList.remove('opacity-100', 'visible');
        scrollTopBtn.classList.add('opacity-0', 'invisible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Navigation active state
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-primary');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-primary');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.animate-slideInLeft, .animate-slideInRight').forEach(el => {
    observer.observe(el);
});

// Typing effect for hero section
const heroTitle = document.querySelector('#home h1');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Progress bars animation
const progressBars = document.querySelectorAll('[style*="width:"]');
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.transition = 'width 2s ease-in-out';
                progressBar.style.width = width;
            }, 200);
        }
    });
}, { threshold: 0.5 });

progressBars.forEach(bar => {
    progressObserver.observe(bar);
});

// Skills hover effects
document.querySelectorAll('.group').forEach(skillCard => {
    skillCard.addEventListener('mouseenter', () => {
        const icon = skillCard.querySelector('i, div');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    skillCard.addEventListener('mouseleave', () => {
        const icon = skillCard.querySelector('i, div');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Project cards tilt effect
document.querySelectorAll('#projects .group').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = -(x - centerX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
});

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('#home .absolute');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate elements on load
    const animateElements = document.querySelectorAll('.animate-fadeInUp');
    animateElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Dark mode theme (already dark, but could be extended)
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Load GitHub profile and projects
    fetchGitHubProfile();
    fetchGitHubProjects();
    
    // Retry button for projects
    const retryButton = document.getElementById('retry-projects');
    if (retryButton) {
        retryButton.addEventListener('click', fetchGitHubProjects);
    }
    
    // Add ripple effect to buttons
    document.querySelectorAll('button, .bg-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .loaded {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
