// Pip-Boy Advanced Table JavaScript
// Provides sorting, filtering, and pagination functionality

class PipTable {
    constructor(tableId, options = {}) {
        this.table = document.getElementById(tableId);
        if (!this.table) return;
        
        this.options = {
            itemsPerPage: options.itemsPerPage || 10,
            sortable: options.sortable !== false,
            searchable: options.searchable !== false,
            paginated: options.paginated !== false
        };
        
        this.currentPage = 1;
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.searchTerm = '';
        this.allRows = [];
        
        this.init();
    }
    
    init() {
        // Store all rows
        const tbody = this.table.querySelector('tbody');
        if (tbody) {
            this.allRows = Array.from(tbody.querySelectorAll('tr'));
        }
        
        // Setup sorting
        if (this.options.sortable) {
            this.setupSorting();
        }
        
        // Setup search
        if (this.options.searchable) {
            this.setupSearch();
        }
        
        // Setup pagination
        if (this.options.paginated) {
            this.setupPagination();
        }
        
        this.render();
    }
    
    setupSorting() {
        const headers = this.table.querySelectorAll('th.sortable');
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                if (this.sortColumn === index) {
                    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = index;
                    this.sortDirection = 'asc';
                }
                
                // Update header classes
                headers.forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });
                header.classList.add(`sort-${this.sortDirection}`);
                
                this.sortRows();
                this.render();
            });
        });
    }
    
    setupSearch() {
        const searchContainer = this.table.previousElementSibling;
        if (searchContainer && searchContainer.classList.contains('pip-table-search')) {
            const searchInput = searchContainer.querySelector('input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchTerm = e.target.value.toLowerCase();
                    this.currentPage = 1;
                    this.render();
                });
            }
        }
    }
    
    setupPagination() {
        const paginationContainer = this.table.nextElementSibling;
        if (paginationContainer && paginationContainer.classList.contains('pip-table-pagination')) {
            this.paginationContainer = paginationContainer;
        }
    }
    
    sortRows() {
        if (this.sortColumn === null) return;
        
        this.allRows.sort((a, b) => {
            const aValue = a.cells[this.sortColumn].textContent.trim();
            const bValue = b.cells[this.sortColumn].textContent.trim();
            
            // Try to parse as numbers
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            let comparison = 0;
            if (!isNaN(aNum) && !isNaN(bNum)) {
                comparison = aNum - bNum;
            } else {
                comparison = aValue.localeCompare(bValue);
            }
            
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
    }
    
    filterRows() {
        if (!this.searchTerm) return this.allRows;
        
        return this.allRows.filter(row => {
            const text = row.textContent.toLowerCase();
            return text.includes(this.searchTerm);
        });
    }
    
    render() {
        const filteredRows = this.filterRows();
        const totalItems = filteredRows.length;
        const totalPages = Math.ceil(totalItems / this.options.itemsPerPage);
        
        // Ensure current page is valid
        if (this.currentPage > totalPages) {
            this.currentPage = totalPages || 1;
        }
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.options.itemsPerPage;
        const endIndex = startIndex + this.options.itemsPerPage;
        const pageRows = filteredRows.slice(startIndex, endIndex);
        
        // Update table body
        const tbody = this.table.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            pageRows.forEach(row => tbody.appendChild(row.cloneNode(true)));
        }
        
        // Update pagination
        if (this.options.paginated && this.paginationContainer) {
            this.renderPagination(totalItems, totalPages);
        }
    }
    
    renderPagination(totalItems, totalPages) {
        const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.options.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.options.itemsPerPage, totalItems);
        
        const info = this.paginationContainer.querySelector('.pip-pagination-info');
        if (info) {
            info.textContent = `Showing ${startItem}-${endItem} of ${totalItems}`;
        }
        
        const controls = this.paginationContainer.querySelector('.pip-pagination-controls');
        if (controls) {
            controls.innerHTML = '';
            
            // Previous button
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '‹';
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.onclick = () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.render();
                }
            };
            controls.appendChild(prevBtn);
            
            // Page numbers
            const maxButtons = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
            let endPage = Math.min(totalPages, startPage + maxButtons - 1);
            
            if (endPage - startPage < maxButtons - 1) {
                startPage = Math.max(1, endPage - maxButtons + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.classList.toggle('active', i === this.currentPage);
                pageBtn.onclick = () => {
                    this.currentPage = i;
                    this.render();
                };
                controls.appendChild(pageBtn);
            }
            
            // Next button
            const nextBtn = document.createElement('button');
            nextBtn.textContent = '›';
            nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
            nextBtn.onclick = () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.render();
                }
            };
            controls.appendChild(nextBtn);
        }
    }
}
