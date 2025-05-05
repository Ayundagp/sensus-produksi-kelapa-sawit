/**
 * API Module for handling data storage operations
 * Currently using localStorage for demo, can be replaced with actual API calls
 */

// Constants for localStorage keys
const STORAGE_KEYS = {
    IS_LOGGED: 'isLogged',
    LOGGED_USER: 'loggedUser',
    REMEMBER_ME: 'rememberMe',
    TREES: 'trees'
};

// Demo credentials (for development only)
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

/**
 * Simulates an API login request
 * @param {Object} credentials - Contains username and password
 * @returns {Promise} Resolves with user data or rejects with error
 */
async function apiLogin(credentials) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Demo validation
        if (credentials.username === DEMO_CREDENTIALS.username && 
            credentials.password === DEMO_CREDENTIALS.password) {
            
            // Store authentication data
            localStorage.setItem(STORAGE_KEYS.IS_LOGGED, 'true');
            localStorage.setItem(STORAGE_KEYS.LOGGED_USER, credentials.username);
            
            return {
                success: true,
                user: {
                    username: credentials.username,
                    role: 'admin'
                }
            };
        } else {
            throw new Error('Username atau password salah');
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Saves production (tree) data
 * @param {Object} treeData - The tree data to save
 * @returns {Promise} Resolves with saved data or rejects with error
 */
async function saveProduction(treeData) {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get existing trees
        let trees = JSON.parse(localStorage.getItem(STORAGE_KEYS.TREES) || '[]');
        
        // Add new tree
        trees.push({
            ...treeData,
            timestamp: new Date().toISOString()
        });

        // Save updated trees
        localStorage.setItem(STORAGE_KEYS.TREES, JSON.stringify(trees));

        return {
            success: true,
            data: treeData
        };
    } catch (error) {
        throw new Error('Gagal menyimpan data produksi: ' + error.message);
    }
}

/**
 * Retrieves all production data
 * @returns {Promise} Resolves with array of tree data
 */
async function getProductions() {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const trees = JSON.parse(localStorage.getItem(STORAGE_KEYS.TREES) || '[]');
        return {
            success: true,
            data: trees
        };
    } catch (error) {
        throw new Error('Gagal mengambil data produksi: ' + error.message);
    }
}

/**
 * Deletes a production record
 * @param {number} index - Index of the tree to delete
 * @returns {Promise} Resolves with success status
 */
async function deleteProduction(index) {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        let trees = JSON.parse(localStorage.getItem(STORAGE_KEYS.TREES) || '[]');
        
        if (index >= 0 && index < trees.length) {
            trees.splice(index, 1);
            localStorage.setItem(STORAGE_KEYS.TREES, JSON.stringify(trees));
            return {
                success: true,
                message: 'Data berhasil dihapus'
            };
        } else {
            throw new Error('Index tidak valid');
        }
    } catch (error) {
        throw new Error('Gagal menghapus data: ' + error.message);
    }
}

/**
 * Handles user logout
 * @returns {Promise} Resolves when logout is complete
 */
async function logout() {
    try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED);
        localStorage.removeItem(STORAGE_KEYS.LOGGED_USER);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

        return {
            success: true,
            message: 'Berhasil logout'
        };
    } catch (error) {
        throw new Error('Gagal logout: ' + error.message);
    }
}

// Export all functions
window.api = {
    login: apiLogin,
    saveProduction,
    getProductions,
    deleteProduction,
    logout
};
