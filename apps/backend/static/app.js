// WriteWise Frontend Application
class WriteWiseApp {
    constructor() {
        this.apiBase = '';
        this.currentUser = null;
        this.token = localStorage.getItem('writewise_token');
        this.init();
    }

    init() {
        this.setupEventListeners();
        if (this.token) {
            this.getCurrentUser();
        }
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Essay form
        document.getElementById('essayForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createEssay();
        });
    }

    async apiCall(endpoint, options = {}) {
        const url = `${this.apiBase}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'API call failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    showLoading() {
        const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
        modal.show();
    }

    hideLoading() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('loadingModal'));
        if (modal) modal.hide();
    }

    showToast(message, type = 'success') {
        const toastId = type === 'success' ? 'successToast' : 'errorToast';
        const toastBodyId = type === 'success' ? 'successToastBody' : 'errorToastBody';
        
        document.getElementById(toastBodyId).textContent = message;
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();
    }

    async login() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email) {
            this.showToast('Please select a demo account', 'error');
            return;
        }

        this.showLoading();

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                this.token = data.access_token;
                localStorage.setItem('writewise_token', this.token);
                await this.getCurrentUser();
                this.showToast('Login successful!');
            } else {
                throw new Error(data.detail || 'Login failed');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.apiCall('/auth/me');
            this.currentUser = user;
            this.showApp();
            this.updateDashboard();
        } catch (error) {
            console.error('Failed to get current user:', error);
            this.logout();
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('writewise_token');
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('appSection').style.display = 'none';
    }

    showApp() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('appSection').style.display = 'block';
        document.getElementById('userEmail').textContent = this.currentUser.email;
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        document.getElementById(sectionName).style.display = 'block';

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        event.target.classList.add('active');

        // Load section data
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'essays':
                this.loadEssays();
                break;
            case 'reviews':
                this.loadReviews();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }

    async updateDashboard() {
        try {
            // Load user's essays
            const essays = await this.apiCall('/essays');
            
            // Calculate stats
            const totalEssays = essays.length;
            const completedEssays = essays.filter(e => !e.is_draft);
            const avgScore = this.calculateAverageScore(essays);

            // Update dashboard stats
            document.getElementById('totalEssays').textContent = totalEssays;
            document.getElementById('avgScore').textContent = avgScore.toFixed(1);
            document.getElementById('pendingReviews').textContent = '0'; // TODO: Implement
            document.getElementById('aiReviews').textContent = '0'; // TODO: Implement

            // Show recent essays
            this.displayRecentEssays(essays.slice(0, 5));

        } catch (error) {
            console.error('Failed to update dashboard:', error);
        }
    }

    calculateAverageScore(essays) {
        // This is a placeholder - in real app, you'd fetch reviews
        return 8.5;
    }

    displayRecentEssays(essays) {
        const container = document.getElementById('recentEssays');
        
        if (essays.length === 0) {
            container.innerHTML = '<p class="text-muted">No essays yet. <a href="#" onclick="showSection(\'essays\')">Create your first essay</a></p>';
            return;
        }

        container.innerHTML = essays.map(essay => `
            <div class="card essay-card ${essay.is_draft ? 'draft' : 'completed'} mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="card-title">${essay.title}</h6>
                            <p class="card-text text-muted small">
                                ${essay.content.substring(0, 100)}...
                            </p>
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>
                                ${new Date(essay.created_at).toLocaleDateString()}
                                <span class="badge ${essay.is_draft ? 'bg-warning' : 'bg-success'} ms-2">
                                    ${essay.is_draft ? 'Draft' : 'Published'}
                                </span>
                            </small>
                        </div>
                        <div class="ms-3">
                            <button class="btn btn-sm btn-outline-primary" onclick="app.viewEssay(${essay.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadEssays() {
        try {
            const essays = await this.apiCall('/essays');
            this.displayEssays(essays);
        } catch (error) {
            console.error('Failed to load essays:', error);
            this.showToast('Failed to load essays', 'error');
        }
    }

    displayEssays(essays) {
        const container = document.getElementById('essaysList');
        
        if (essays.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h5>No essays yet</h5>
                    <p>Start writing by creating your first essay!</p>
                    <button class="btn btn-primary" onclick="showNewEssayForm()">
                        <i class="fas fa-plus me-2"></i>Create Essay
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = essays.map(essay => `
            <div class="card essay-card ${essay.is_draft ? 'draft' : 'completed'} mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h5 class="card-title">${essay.title}</h5>
                            <div class="essay-content mb-3">
                                ${essay.content}
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="fas fa-calendar me-1"></i>
                                    Created: ${new Date(essay.created_at).toLocaleDateString()}
                                    <span class="badge ${essay.is_draft ? 'bg-warning' : 'bg-success'} ms-2">
                                        ${essay.is_draft ? 'Draft' : 'Published'}
                                    </span>
                                </small>
                                <div>
                                    <button class="btn btn-sm btn-outline-primary me-2" onclick="app.viewEssay(${essay.id})">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="app.editEssay(${essay.id})">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    ${!essay.is_draft ? `
                                        <button class="btn btn-sm btn-outline-success" onclick="app.requestAIReview(${essay.id})">
                                            <i class="fas fa-robot"></i> AI Review
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async loadReviews() {
        try {
            const reviews = await this.apiCall('/reviews/my');
            this.displayReviews(reviews);
        } catch (error) {
            console.error('Failed to load reviews:', error);
            // Try to load reviews for essays instead
            this.loadEssayReviews();
        }
    }

    async loadEssayReviews() {
        try {
            const essays = await this.apiCall('/essays');
            let allReviews = [];
            
            for (const essay of essays) {
                try {
                    const reviews = await this.apiCall(`/reviews/essay/${essay.id}`);
                    allReviews = allReviews.concat(reviews);
                } catch (error) {
                    // Skip essays without reviews
                }
            }
            
            this.displayReviews(allReviews);
        } catch (error) {
            console.error('Failed to load essay reviews:', error);
            this.showToast('Failed to load reviews', 'error');
        }
    }

    displayReviews(reviews) {
        const container = document.getElementById('reviewsList');
        
        if (reviews.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-star"></i>
                    <h5>No reviews yet</h5>
                    <p>Reviews will appear here once your essays are reviewed.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = reviews.map(review => `
            <div class="card review-card ${review.ai_summary ? 'ai' : ''} mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <h6 class="card-title">Essay Review</h6>
                            <span class="badge ${review.ai_summary ? 'ai-badge' : 'teacher-badge'}">
                                ${review.ai_summary ? 'AI Review' : 'Teacher Review'}
                            </span>
                        </div>
                        <small class="text-muted">
                            ${new Date(review.created_at).toLocaleDateString()}
                        </small>
                    </div>
                    
                    ${review.comments ? `
                        <div class="review-content">
                            <strong>Comments:</strong><br>
                            ${review.comments}
                        </div>
                    ` : ''}
                    
                    ${review.ai_summary ? `
                        <div class="review-content mt-2">
                            <strong>AI Summary:</strong><br>
                            ${review.ai_summary}
                        </div>
                    ` : ''}
                    
                    <div class="row mt-3">
                        <div class="col-md-4">
                            <div class="score-display">
                                <div class="score-circle ${this.getScoreClass(review.grammar_score)}">
                                    ${review.grammar_score || 'N/A'}
                                </div>
                                <div>
                                    <small class="text-muted">Grammar</small><br>
                                    <strong>${review.grammar_score || 'N/A'}/10</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="score-display">
                                <div class="score-circle ${this.getScoreClass(review.clarity_score)}">
                                    ${review.clarity_score || 'N/A'}
                                </div>
                                <div>
                                    <small class="text-muted">Clarity</small><br>
                                    <strong>${review.clarity_score || 'N/A'}/10</strong>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="score-display">
                                <div class="score-circle ${this.getScoreClass(review.argument_score)}">
                                    ${review.argument_score || 'N/A'}
                                </div>
                                <div>
                                    <small class="text-muted">Argument</small><br>
                                    <strong>${review.argument_score || 'N/A'}/10</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getScoreClass(score) {
        if (!score) return 'average';
        if (score >= 8) return 'excellent';
        if (score >= 6) return 'good';
        if (score >= 4) return 'average';
        return 'poor';
    }

    async loadAnalytics() {
        try {
            const analytics = await this.apiCall('/analytics/summary');
            this.displayAnalytics(analytics);
        } catch (error) {
            console.error('Failed to load analytics:', error);
            this.showToast('Analytics not available', 'error');
        }
    }

    displayAnalytics(data) {
        // Create sample charts
        this.createPerformanceChart();
        this.createScoreChart(data);
    }

    createPerformanceChart() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Average Score',
                    data: [7.2, 7.8, 8.1, 8.5],
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                }
            }
        });
    }

    createScoreChart(data) {
        const ctx = document.getElementById('scoreChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Grammar', 'Clarity', 'Argument'],
                datasets: [{
                    data: [
                        data.grammar_avg || 8.5,
                        data.clarity_avg || 8.0,
                        data.argument_avg || 7.5
                    ],
                    backgroundColor: [
                        '#007bff',
                        '#28a745',
                        '#ffc107'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    showNewEssayForm() {
        document.getElementById('newEssayForm').style.display = 'block';
        document.getElementById('essayTitle').focus();
    }

    hideNewEssayForm() {
        document.getElementById('newEssayForm').style.display = 'none';
        document.getElementById('essayForm').reset();
    }

    async createEssay() {
        const title = document.getElementById('essayTitle').value;
        const content = document.getElementById('essayContent').value;
        const isDraft = document.getElementById('isDraft').checked;

        if (!title || !content) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        this.showLoading();

        try {
            await this.apiCall('/essays', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    content,
                    is_draft: isDraft
                })
            });

            this.showToast('Essay saved successfully!');
            this.hideNewEssayForm();
            this.loadEssays();
            this.updateDashboard();
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async requestAIReview(essayId) {
        this.showLoading();

        try {
            await this.apiCall(`/essays/${essayId}/ai-feedback`, {
                method: 'POST'
            });

            this.showToast('AI review requested! Check back in a few moments.');
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    viewEssay(essayId) {
        // TODO: Implement essay viewing modal
        this.showToast('Essay viewing feature coming soon!');
    }

    editEssay(essayId) {
        // TODO: Implement essay editing
        this.showToast('Essay editing feature coming soon!');
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    app.showSection(sectionName);
}

function showNewEssayForm() {
    app.showNewEssayForm();
}

function hideNewEssayForm() {
    app.hideNewEssayForm();
}

function logout() {
    app.logout();
}

// Initialize the application
const app = new WriteWiseApp();
