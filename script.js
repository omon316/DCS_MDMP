// Globale Funktion muss VOR DOMContentLoaded definiert sein, 
// damit sie vom HTML onclick="" gefunden wird.
window.loadChartImage = function(imageUrl) {
    const viewContainer = document.getElementById('screen-view-container');
    const template = document.getElementById('template-chart-view');
    
    // View wechseln
    viewContainer.innerHTML = "";
    const content = template.content.cloneNode(true);
    viewContainer.appendChild(content);

    // Bild setzen
    const imgElement = document.getElementById('chart-display-img');
    imgElement.src = imageUrl;

    // Back Button (geht hier zurück zur Liste, nicht Main)
    const backBtn = viewContainer.querySelector('.btn-back');
    backBtn.onclick = () => loadView('charts-menu');
};

// Interne Hilfsfunktion
let loadView; 

document.addEventListener('DOMContentLoaded', () => {
    const viewContainer = document.getElementById('screen-view-container');
    const deskItems = document.querySelectorAll('.desk-item[data-target]');
    const editorSwitch = document.getElementById('editor-switch');
    let isEditorMode = false;

    // --- VIEW LOGIK ---
    loadView = function(viewName) {
        const templateId = 'template-' + viewName;
        const template = document.getElementById(templateId);
        
        if(template) {
            viewContainer.innerHTML = "";
            const content = template.content.cloneNode(true);
            viewContainer.appendChild(content);

            // Back Button zu Main Menü
            const backBtn = viewContainer.querySelector('.btn-back');
            // Wenn wir im Chart-View sind, hat der Button schon einen Handler (siehe oben)
            // Ansonsten Standard:
            if(backBtn && !backBtn.onclick) backBtn.onclick = loadMainMenu;

            applyEditorState();
        }
    };

    function loadMainMenu() {
        viewContainer.innerHTML = `
            <div class="view-main">
                <div class="falcon-logo" style="font-family:'Black Ops One'; font-size:1.5rem;">F-16C BLK 50</div>
                <p>SYSTEM READY.</p>
                <p>SELECT PAGE.</p>
            </div>
        `;
    }

    // --- EVENT LISTENER ---
    deskItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            loadView(target);
            
            // Animation
            item.style.transform = "scale(0.98)";
            setTimeout(() => { item.style.transform = ""; }, 100);
        });
    });

    // --- EDITOR MODE ---
    editorSwitch.addEventListener('click', () => {
        isEditorMode = !isEditorMode;
        
        // Schalter Animation
        editorSwitch.classList.toggle('edit-mode-active', isEditorMode);
        
        // System Status im Monitor
        const modeIndicator = document.querySelector('.mode-indicator');
        if(modeIndicator) {
            modeIndicator.textContent = isEditorMode ? "EDIT_ARMED" : "NAV_MODE";
            modeIndicator.style.color = isEditorMode ? "#ffb300" : "";
        }

        applyEditorState();
    });

    function applyEditorState() {
        const editables = document.querySelectorAll('.content-editable');
        editables.forEach(el => {
            el.contentEditable = isEditorMode;
        });
    }

    // Uhrzeit
    setInterval(() => {
        const now = new Date();
        const timeString = now.toISOString().split('T')[1].split('.')[0] + 'Z';
        const clock = document.getElementById('clock');
        if(clock) clock.textContent = timeString;
    }, 1000);
});
