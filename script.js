document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const categorySearch = document.getElementById('category-search');

    let talks = [];

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        });

    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date('2025-10-27T10:00:00');

        talksToRender.forEach((talk, index) => {
            const talkElement = document.createElement('div');
            talkElement.classList.add('talk');

            const startTime = new Date(currentTime);
            const endTime = new Date(currentTime.getTime() + talk.duration * 60000);

            talkElement.innerHTML = `
                <h3>${startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h3>
                <h2>${talk.title}</h2>
                <p class="speakers">${talk.speakers.join(', ')}</p>
                <p>${talk.description}</p>
                <div class="categories">
                    ${talk.category.map(cat => `<span>${cat}</span>`).join('')}
                </div>
            `;
            scheduleContainer.appendChild(talkElement);

            currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

            if (index === 2) { // Lunch break after the 3rd talk
                const lunchBreakElement = document.createElement('div');
                lunchBreakElement.classList.add('talk');
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(currentTime.getTime() + 60 * 60000);
                lunchBreakElement.innerHTML = `<h3>${lunchStartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${lunchEndTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</h3><h2>Lunch Break</h2>`;
                scheduleContainer.appendChild(lunchBreakElement);
                currentTime = lunchEndTime;
            }
        });
    }

    categorySearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = talks.filter(talk => {
            return talk.category.some(cat => cat.toLowerCase().includes(searchTerm));
        });
        renderSchedule(filteredTalks);
    });
});
