// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    let map;
    let marker = null;
    
    try {
        map = L.map('map').setView([-1.2921, 116.8271], 13); // Default center on East Kalimantan
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Initialize stored trees array
        let trees = JSON.parse(localStorage.getItem('trees') || '[]');

        // Handle map clicks
        map.on('click', function(e) {
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);
            
            // Update form coordinates
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;
            
            // Update or create marker
            if (marker) {
                marker.setLatLng(e.latlng);
            } else {
                marker = L.marker(e.latlng).addTo(map);
            }
        });

        // Handle form submission
        document.getElementById('treeForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const treeData = {
                id: document.getElementById('treeId').value,
                age: document.getElementById('treeAge').value,
                height: document.getElementById('treeHeight').value,
                production: document.getElementById('production').value,
                health: document.getElementById('healthCondition').value,
                notes: document.getElementById('notes').value,
                latitude: document.getElementById('latitude').value,
                longitude: document.getElementById('longitude').value,
                timestamp: new Date().toISOString()
            };
            
            // Validate coordinates
            if (!treeData.latitude || !treeData.longitude) {
                alert('Silakan pilih lokasi pohon pada peta');
                return;
            }
            
            // Save to local storage
            trees.push(treeData);
            localStorage.setItem('trees', JSON.stringify(trees));
            
            // Add marker to map with popup
            const newMarker = L.marker([treeData.latitude, treeData.longitude])
                .bindPopup(`
                    <strong>ID: ${treeData.id}</strong><br>
                    Produksi: ${treeData.production} kg<br>
                    Umur: ${treeData.age} tahun<br>
                    Kondisi: ${treeData.health}
                `)
                .addTo(map);
            
            // Update tree list
            updateTreeList();
            
            // Reset form and marker
            e.target.reset();
            if (marker) {
                marker.remove();
                marker = null;
            }
            
            alert('Data pohon berhasil disimpan!');
        });

        // Function to update tree list
        function updateTreeList() {
            const treeList = document.getElementById('treeList');
            treeList.innerHTML = '';
            
            trees.forEach((tree, index) => {
                const treeItem = document.createElement('div');
                treeItem.className = 'p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer mb-2';
                treeItem.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-medium">Pohon ID: ${tree.id}</h3>
                            <p class="text-sm text-gray-600">Produksi: ${tree.production} kg</p>
                            <p class="text-sm text-gray-600">Kondisi: ${tree.health}</p>
                        </div>
                        <button onclick="deleteTree(${index})" class="text-red-600 hover:text-red-800">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                // Add click event to center map on tree
                treeItem.addEventListener('click', (e) => {
                    // Don't trigger if clicking delete button
                    if (!e.target.closest('button')) {
                        map.setView([tree.latitude, tree.longitude], 15);
                    }
                });
                
                treeList.appendChild(treeItem);
            });
        }

        // Function to delete tree
        window.deleteTree = function(index) {
            if (confirm('Apakah Anda yakin ingin menghapus data pohon ini?')) {
                trees.splice(index, 1);
                localStorage.setItem('trees', JSON.stringify(trees));
                updateTreeList();
                
                // Refresh map markers
                map.eachLayer((layer) => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });
                
                // Reload existing markers
                trees.forEach(tree => {
                    L.marker([tree.latitude, tree.longitude])
                        .bindPopup(`
                            <strong>ID: ${tree.id}</strong><br>
                            Produksi: ${tree.production} kg<br>
                            Umur: ${tree.age} tahun<br>
                            Kondisi: ${tree.health}
                        `)
                        .addTo(map);
                });
            }
        };

        // Initial load of tree list and markers
        updateTreeList();
        trees.forEach(tree => {
            L.marker([tree.latitude, tree.longitude])
                .bindPopup(`
                    <strong>ID: ${tree.id}</strong><br>
                    Produksi: ${tree.production} kg<br>
                    Umur: ${tree.age} tahun<br>
                    Kondisi: ${tree.health}
                `)
                .addTo(map);
        });

    } catch (error) {
        console.error('Error initializing map:', error);
        alert('Terjadi kesalahan saat memuat peta. Silakan muat ulang halaman.');
    }
});

// Logout functionality
window.handleLogout = function() {
    try {
        localStorage.removeItem('isLogged');
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('rememberMe');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Terjadi kesalahan saat logout.');
    }
};
