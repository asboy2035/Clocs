document.addEventListener('DOMContentLoaded', () => {
    const clocksContainer = document.getElementById('clocks-container');
    const addClockBtn = document.getElementById('add-clock-btn');
    const popup = document.getElementById('popup');
    const popupClockName = document.getElementById('popup-clock-name');
    const popupTime = document.getElementById('popup-time');
    const managePeopleBtn = document.getElementById('manage-people-btn');
    const renameBtn = document.getElementById('rename-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const closePopupBtn = document.getElementById('close-popup');
    const managePeople = document.getElementById('manage-people');
    const peopleList = document.getElementById('people-list');
    const personNameInput = document.getElementById('person-name-input');
    const addPersonBtn = document.getElementById('add-person-btn');
    const exportBtn = document.getElementById('export-data');
    const importBtn = document.getElementById('import-data');
    const fileInput = document.getElementById('file-input');

    let clocks = [];
    let selectedClock = null;

    // Helper function to get current time for a given offset
    const getTimeForOffset = (offset) => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * offset));
    };

    // Function to update clocks display
    const updateClocks = () => {
        clocksContainer.innerHTML = '';
        clocks.forEach((clock, index) => {
            const clockDiv = document.createElement('div');
            clockDiv.className = 'clock';
            clockDiv.dataset.index = index;
            clockDiv.innerHTML = `
                <h2>${clock.name}</h2><br>
                ${getTimeForOffset(clock.offset).toLocaleTimeString()}<br>
                <p class="people">${clock.people.length > 0 ? clock.people.join(', ') : '-'}</p>
            `;
            clockDiv.addEventListener('click', () => openPopup(clock));
            clocksContainer.appendChild(clockDiv);
        });
        saveClocksToLocalStorage();
    };

    // Function to open clock popup
    const openPopup = (clock) => {
        selectedClock = clock;
        popupClockName.textContent = clock.name;
        popupTime.textContent = getTimeForOffset(clock.offset).toLocaleTimeString();
        updatePeopleList();
        popup.classList.remove('hidden');
    };

    const updatePeopleList = () => {
        peopleList.innerHTML = '';
        selectedClock.people.forEach((person, index) => {
            const li = document.createElement('li');
            li.textContent = person;
    
            // Create delete button for each person
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Remove';
            deleteBtn.classList.add('remove-btn');
            deleteBtn.addEventListener('click', () => {
                selectedClock.people.splice(index, 1); // Remove person from the list
                updatePeopleList(); // Update the display
                saveClocksToLocalStorage(); // Save changes to localStorage
            });
    
            li.appendChild(deleteBtn); // Add the delete button to the list item
            peopleList.appendChild(li); // Add the list item to the people list
        });
    };    

    const saveClocksToLocalStorage = () => {
        localStorage.setItem('worldClockData', JSON.stringify(clocks));
    };

    const loadClocksFromLocalStorage = () => {
        const storedClocks = localStorage.getItem('worldClockData');
        if (storedClocks) {
            clocks = JSON.parse(storedClocks);
        } else {
            clocks.push({
                name: "Local Time",
                offset: new Date().getTimezoneOffset() / -60,
                people: []
            });
        }
        updateClocks();
    };

    addClockBtn.addEventListener('click', () => {
        const offset = prompt('GMT offset (e.g -5, 3):');
        const name = prompt('Name:');
        if (offset && name) {
            clocks.push({ name, offset: parseInt(offset), people: [] });
            updateClocks();
        }
    });

    renameBtn.addEventListener('click', () => {
        const newName = prompt('New Name:', selectedClock.name);
        if (newName) {
            selectedClock.name = newName;
            updateClocks();
            openPopup(selectedClock);
        }
    });

    deleteBtn.addEventListener('click', () => {
        clocks = clocks.filter(clock => clock !== selectedClock);
        popup.classList.add('hidden');
        updateClocks();
    });

    closePopupBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    addPersonBtn.addEventListener('click', () => {
        const personName = personNameInput.value.trim();
        if (personName) {
            selectedClock.people.push(personName);
            updatePeopleList();
            personNameInput.value = '';
            saveClocksToLocalStorage();
        }
    });

    // Export data to JSON
    exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(clocks, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'clocs-backup.json';
        a.click();

        URL.revokeObjectURL(url);
    });

    // Import data from JSON
    importBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedData = JSON.parse(e.target.result);
                clocks = importedData;
                updateClocks();
            };
            reader.readAsText(file);
        }
    });

    // Initialize data from localStorage
    loadClocksFromLocalStorage();
    setInterval(updateClocks, 1000);
}); // Update clocks every second

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then((registration) => {
        console.log('Service worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
} else {
  console.log('Service workers are not supported.');
}