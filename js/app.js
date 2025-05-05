// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize the map
    let map;
    let marker = null;
    let trees = [];
    
    try {
        map = L.map('map').setView([-1.2921, 116.8271], 13); // Default center on East Kalimantan
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Load initial tree data
        const response = await window.api.getProductions();
        trees = response.data;

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
        document.getElementById('treeForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const treeData = {
                // Location & Classification
                region: document.getElementById('region').value,
                area: document.getElementById('area').value,
                kebun: document.getElementById('kebun').value,
                divisi: document.getElementById('divisi').value,
                blok: document.getElementById('blok').value,
                arahMasuk: document.getElementById('arahMasuk').value,
                noBaris: document.getElementById('noBaris').value,
                noPokok: document.getElementById('noPokok').value,
                
                // Tree Identification
                id: document.getElementById('treeId').value,
                age: document.getElementById('treeAge').value,
                height: document.getElementById('treeHeight').value,
                
                // Tree Condition
                kondisiPokok: document.getElementById('kondisiPokok').value,
                health: document.getElementById('healthCondition').value,
                
                // Production Data
                buahBulan1: document.getElementById('buahBulan1').value,
                buahBulan2: document.getElementById('buahBulan2').value,
                buahBulan3: document.getElementById('buahBulan3').value,
                buahBulan4: document.getElementById('buahBulan4').value,
                totalBunga: document.getElementById('totalBunga').value,
                
                // Notes & Location
                notes: document.getElementById('notes').value,
                latitude: document.getElementById('latitude').value,
                longitude: document.getElementById('longitude').value
            };
            
            // Validate coordinates
            if (!treeData.latitude || !treeData.longitude) {
                alert('Silakan pilih lokasi pohon pada peta');
                return;
            }
            
            try {
                // Save to storage via API
                const response = await window.api.saveProduction(treeData);
                
                // Add marker to map with popup
                const newMarker = L.marker([treeData.latitude, treeData.longitude])
                    .bindPopup(`
                        <strong>ID: ${treeData.id}</strong><br>
                        Region: ${treeData.region} - ${treeData.area}<br>
                        Lokasi: Kebun ${treeData.kebun}, Divisi ${treeData.divisi}, Blok ${treeData.blok}<br>
                        Baris/Pokok: ${treeData.noBaris}/${treeData.noPokok}<br>
                        Kondisi: ${treeData.kondisiPokok} (${treeData.health})<br>
                        Total Buah: ${Number(treeData.buahBulan1) + Number(treeData.buahBulan2) + Number(treeData.buahBulan3) + Number(treeData.buahBulan4)} buah<br>
                        Total Bunga: ${treeData.totalBunga} bunga
                    `)
                    .addTo(map);
                
                // Refresh tree data and update list
                const updatedData = await window.api.getProductions();
                trees = updatedData.data;
                updateTreeList();
                
                // Reset form and marker
                e.target.reset();
                if (marker) {
                    marker.remove();
                    marker = null;
                }
                
                alert('Data pohon berhasil disimpan!');
            } catch (error) {
                console.error('Error saving tree data:', error);
                alert(error.message || 'Gagal menyimpan data pohon');
            }
        });

        // Function to update tree list
        function updateTreeList() {
            const treeList = document.getElementById('treeList');
            treeList.innerHTML = '';
            
            trees.forEach((tree, index) => {
                const treeItem = document.createElement('div');
                treeItem.className = 'p-3 bg-gray-50 rounded-md hover:bg-gray-100 mb-2 transition-colors duration-200';
                treeItem.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex-grow cursor-pointer" onclick="map.setView([${tree.latitude}, ${tree.longitude}], 15)">
                            <h3 class="font-medium">Pohon ID: ${tree.id}</h3>
                            <p class="text-sm text-gray-600">Region: ${tree.region} - ${tree.area}</p>
                            <p class="text-sm text-gray-600">Lokasi: Kebun ${tree.kebun}, Blok ${tree.blok}</p>
                            <p class="text-sm text-gray-600">Kondisi: ${tree.kondisiPokok} (${tree.health})</p>
                            <p class="text-sm text-gray-600">Total Buah: ${Number(tree.buahBulan1) + Number(tree.buahBulan2) + Number(tree.buahBulan3) + Number(tree.buahBulan4)} | Bunga: ${tree.totalBunga}</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="showTreePreview(${index})" 
                                class="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1.5 hover:bg-blue-50 rounded-full"
                                title="Lihat Detail">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button onclick="deleteTree(${index})" 
                                class="text-red-600 hover:text-red-800 transition-colors duration-200 p-1.5 hover:bg-red-50 rounded-full"
                                title="Hapus">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                treeList.appendChild(treeItem);
            });
        }

        // Preview Modal Functions
        function closeTreePreview() {
            document.getElementById('treePreviewModal').classList.add('hidden');
        }

        window.showTreePreview = function(index) {
            const tree = trees[index];
            if (!tree) return alert("Data pohon tidak ditemukan.");
            
            // Populate the preview content
            document.getElementById('previewTreeTitle').textContent = `Pohon ID: ${tree.id}`;
            const contentEl = document.getElementById('previewContent');
            contentEl.innerHTML = `
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <p><strong class="text-gray-900">Region:</strong><br/>${tree.region}</p>
                        <p><strong class="text-gray-900">Area:</strong><br/>${tree.area}</p>
                        <p><strong class="text-gray-900">Kebun:</strong><br/>${tree.kebun}</p>
                        <p><strong class="text-gray-900">Divisi:</strong><br/>${tree.divisi}</p>
                    </div>
                    <div class="space-y-2">
                        <p><strong class="text-gray-900">Blok:</strong><br/>${tree.blok}</p>
                        <p><strong class="text-gray-900">Arah Masuk:</strong><br/>${tree.arahMasuk}</p>
                        <p><strong class="text-gray-900">No Baris/Pokok:</strong><br/>${tree.noBaris} / ${tree.noPokok}</p>
                        <p><strong class="text-gray-900">Umur/Tinggi:</strong><br/>${tree.age} tahun / ${tree.height} meter</p>
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <p><strong class="text-gray-900">Kondisi:</strong><br/>${tree.kondisiPokok} (${tree.health})</p>
                    <p class="mt-2"><strong class="text-gray-900">Hasil Produksi:</strong></p>
                    <div class="grid grid-cols-2 gap-4 mt-1">
                        <div>
                            <p>Buah Bulan 1: ${tree.buahBulan1}</p>
                            <p>Buah Bulan 2: ${tree.buahBulan2}</p>
                        </div>
                        <div>
                            <p>Buah Bulan 3: ${tree.buahBulan3}</p>
                            <p>Buah Bulan 4: ${tree.buahBulan4}</p>
                        </div>
                    </div>
                    <p class="mt-2"><strong>Total Buah:</strong> ${Number(tree.buahBulan1) + Number(tree.buahBulan2) + Number(tree.buahBulan3) + Number(tree.buahBulan4)} buah</p>
                    <p><strong>Total Bunga:</strong> ${tree.totalBunga} bunga</p>
                </div>
                ${tree.notes ? `
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <p><strong class="text-gray-900">Catatan:</strong><br/>${tree.notes}</p>
                </div>
                ` : ''}
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <p><strong class="text-gray-900">Koordinat:</strong><br/>
                    Latitude: ${tree.latitude}<br/>
                    Longitude: ${tree.longitude}</p>
                </div>
            `;
            
            // Save the index on the delete button
            document.getElementById('deletePreviewBtn').setAttribute('data-index', index);
            
            // Show modal
            document.getElementById('treePreviewModal').classList.remove('hidden');
        };

        // Add event listeners for modal buttons
        document.getElementById('closePreviewBtn').addEventListener('click', closeTreePreview);
        document.getElementById('closeFooterBtn').addEventListener('click', closeTreePreview);
        document.getElementById('deletePreviewBtn').addEventListener('click', async function() {
            const index = parseInt(this.getAttribute('data-index'));
            await deleteTree(index);
            closeTreePreview();
        });

        // Function to delete tree
        window.deleteTree = async function(index) {
            if (confirm('Apakah Anda yakin ingin menghapus data pohon ini?')) {
                try {
                    await window.api.deleteProduction(index);
                    
                    // Refresh tree data
                    const response = await window.api.getProductions();
                    trees = response.data;
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
                                Region: ${tree.region} - ${tree.area}<br>
                                Lokasi: Kebun ${tree.kebun}, Divisi ${tree.divisi}, Blok ${tree.blok}<br>
                                Baris/Pokok: ${tree.noBaris}/${tree.noPokok}<br>
                                Kondisi: ${tree.kondisiPokok} (${tree.health})<br>
                                Total Buah: ${Number(tree.buahBulan1) + Number(tree.buahBulan2) + Number(tree.buahBulan3) + Number(tree.buahBulan4)} buah<br>
                                Total Bunga: ${tree.totalBunga} bunga
                            `)
                            .addTo(map);
                    });
                } catch (error) {
                    console.error('Error deleting tree:', error);
                    alert(error.message || 'Gagal menghapus data pohon');
                }
            }
        };

        // Initial load of tree list and markers
        updateTreeList();
        trees.forEach(tree => {
            L.marker([tree.latitude, tree.longitude])
                .bindPopup(`
                    <strong>ID: ${tree.id}</strong><br>
                    Region: ${tree.region} - ${tree.area}<br>
                    Lokasi: Kebun ${tree.kebun}, Divisi ${tree.divisi}, Blok ${tree.blok}<br>
                    Baris/Pokok: ${tree.noBaris}/${tree.noPokok}<br>
                    Kondisi: ${tree.kondisiPokok} (${tree.health})<br>
                    Total Buah: ${Number(tree.buahBulan1) + Number(tree.buahBulan2) + Number(tree.buahBulan3) + Number(tree.buahBulan4)} buah<br>
                    Total Bunga: ${tree.totalBunga} bunga
                `)
                .addTo(map);
        });

    } catch (error) {
        console.error('Error initializing map:', error);
        alert('Terjadi kesalahan saat memuat peta. Silakan muat ulang halaman.');
    }
});

// Logout functionality
window.handleLogout = async function() {
    try {
        await window.api.logout();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error during logout:', error);
        alert('Terjadi kesalahan saat logout.');
    }
};
