document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const toolsContainer = document.getElementById('toolsContainer');
    const categoriesContainer = document.querySelector('.categories');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    // State
    let toolsData = [];
    let categories = [];
    let filteredTools = [];
    
    // Initialize the app
    init();
    
    function init() {
        fetchToolsData();
        setupEventListeners();
    }
    
    function fetchToolsData() {
        fetch('tools.json')
            .then(response => response.json())
            .then(data => {
                toolsData = data.tools;
                categories = getAllCategories();
                renderCategories();
                renderTools(toolsData);
            })
            .catch(error => {
                console.error('Error loading tools data:', error);
                toolsContainer.innerHTML = '<div class="error">Failed to load tools. Please try again later.</div>';
            });
    }
    
    function getAllCategories() {
        const allCategories = ['all'];
        toolsData.forEach(tool => {
            if (!allCategories.includes(tool.category)) {
                allCategories.push(tool.category);
            }
        });
        return allCategories;
    }
    
    function renderCategories() {
        categoriesContainer.innerHTML = '';
        
        categories.forEach(category => {
            const categoryElement = document.createElement('li');
            categoryElement.textContent = formatCategoryName(category);
            categoryElement.dataset.category = category;
            
            if (category === 'all') {
                categoryElement.classList.add('active');
            }
            
            categoryElement.addEventListener('click', () => {
                document.querySelector('.categories li.active').classList.remove('active');
                categoryElement.classList.add('active');
                filterToolsByCategory(category);
            });
            
            categoriesContainer.appendChild(categoryElement);
        });
    }
    
    function formatCategoryName(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    function renderTools(tools) {
        toolsContainer.innerHTML = '';
        
        if (tools.length === 0) {
            toolsContainer.innerHTML = '<div class="no-results">No tools found matching your criteria.</div>';
            return;
        }
        
        tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            
            toolCard.innerHTML = `
                <div class="tool-image">
                    <i class="${tool.icon || 'fas fa-tools'}"></i>
                </div>
                <div class="tool-info">
                    <h3>${tool.name}</h3>
                    <p>${tool.description}</p>
                    <div class="tool-meta">
                        <span class="tool-category">${formatCategoryName(tool.category)}</span>
                        <a href="${tool.url}" class="tool-link" target="_blank">Open Tool</a>
                    </div>
                </div>
            `;
            
            toolsContainer.appendChild(toolCard);
        });
    }
    
    function filterToolsByCategory(category) {
        if (category === 'all') {
            filteredTools = [...toolsData];
        } else {
            filteredTools = toolsData.filter(tool => tool.category === category);
        }
        
        // Apply search filter if there's a search term
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            filteredTools = filteredTools.filter(tool => 
                tool.name.toLowerCase().includes(searchTerm) || 
                tool.description.toLowerCase().includes(searchTerm)
            );
        }
        
        renderTools(filteredTools);
    }
    
    function setupEventListeners() {
        // Search functionality
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Mobile menu toggle
        mobileMenuBtn.addEventListener('click', () => {
            categoriesContainer.classList.toggle('show');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!categoriesContainer.contains(e.target) && e.target !== mobileMenuBtn) {
                categoriesContainer.classList.remove('show');
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            // If search is empty, show tools filtered by current category
            const activeCategory = document.querySelector('.categories li.active').dataset.category;
            filterToolsByCategory(activeCategory);
            return;
        }
        
        // Filter by search term across all tools
        filteredTools = toolsData.filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) || 
            tool.description.toLowerCase().includes(searchTerm)
        );
        
        renderTools(filteredTools);
    }
});