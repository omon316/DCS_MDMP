document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURATION ---
    const mapArea = document.getElementById('map-area');
    const editorBtn = document.getElementById('editor-mode-button');
    const navButtons = document.querySelectorAll('.nav-btn');
    const template = document.getElementById('window-template');

    // State
    let isEditorMode = false;
    let windowOffset = 0; // Für versetztes Öffnen
    const activeWindows = {}; // Speichert Referenzen zu offenen Fenstern

    // --- EDITOR MODE TOGGLE ---
    editorBtn.addEventListener('click', () => {
        isEditorMode = !isEditorMode;
        
        // UI Update Button
        editorBtn.textContent = isEditorMode ? "EDITOR MODE: ON" : "EDITOR MODE: OFF";
        editorBtn.classList.toggle('editing', isEditorMode);

        // UI Update Top Bar
        toggleDisplay('mission-name-display', 'mission-name-input');
        toggleDisplay('takeoff-display', 'takeoff-inputs');

        // UI Update Windows (Content Editable machen)
        document.querySelectorAll('.window-content').forEach(content => {
            content.contentEditable = isEditorMode;
        });

        // Add Tabs Buttons zeigen/verstecken
        document.querySelectorAll('.add-tab-btn').forEach(btn => {
            btn.classList.toggle('hidden', !isEditorMode);
        });
    });

    function toggleDisplay(displayId, inputId) {
        const display = document.getElementById(displayId);
        const input = document.getElementById(inputId);
        
        if (isEditorMode) {
            display.classList.add('hidden');
            input.classList.remove('hidden');
            // Werte kopieren (vereinfacht)
        } else {
            display.classList.remove('hidden');
            input.classList.add('hidden');
            // Hier müsste man die Input Werte zurück in das Display schreiben
        }
    }

    // --- FENSTER LOGIK ---
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetName = btn.getAttribute('data-target');

            // Wenn Fenster schon offen -> schließen
            if (activeWindows[targetName]) {
                closeWindow(targetName);
                return;
            }

            // Neues Fenster öffnen
            openWindow(targetName, btn);
        });
    });

    function openWindow(name, btnElement) {
        const clone = template.content.cloneNode(true);
        const winFrame = clone.querySelector('.window-frame');
        const title = clone.querySelector('.window-title');
        const closeBtn = clone.querySelector('.win-close');
        const content = clone.querySelector('.window-content');
        const addTabBtn = clone.querySelector('.add-tab-btn');

        // Setup
        title.textContent = name.toUpperCase();
        winFrame.style.left = (20 + windowOffset) + 'px';
        winFrame.style.top = (20 + windowOffset) + 'px';
        winFrame.style.zIndex = 10 + windowOffset; // Einfaches Stacking
        
        // Editor Status übernehmen
        content.contentEditable = isEditorMode;
        if (!isEditorMode) addTabBtn.classList.add('hidden');

        // Button Style aktivieren
        btnElement.classList.add('active');

        // Offset erhöhen für das nächste Fenster
        windowOffset += 30;
        if (windowOffset > 300) windowOffset = 0; // Reset wenn zu weit unten

        // Event Listener: Schließen
        closeBtn.onclick = () => closeWindow(name);

        // Event Listener: Fenster nach vorne bringen bei Klick
        winFrame.addEventListener('mousedown', () => {
            // Alle Z-Indexe resetten könnte man hier machen, oder einfach erhöhen
            winFrame.style.zIndex = 999; 
        });

        // DRAG FUNKTION (Verschieben)
        makeDraggable(winFrame);

        // In DOM einfügen und speichern
        mapArea.appendChild(winFrame);
        activeWindows[name] = { element: winFrame, button: btnElement };
    }

    function closeWindow(name) {
        if (!activeWindows[name]) return;
        
        const winData = activeWindows[name];
        winData.element.remove();
        winData.button.classList.remove('active'); // Button Farbe zurücksetzen
        
        delete activeWindows[name];
    }

    // --- DRAG AND DROP HELPER ---
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.window-header');
        
        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e.preventDefault();
            // Startposition der Maus
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            // Neue Position berechnen
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Element setzen
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
