document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURATION ---
    // WICHTIG: mapArea ist jetzt der Inhalt des CRT Bildschirms
    const mapArea = document.getElementById('map-area'); 
    const editorBtn = document.getElementById('editor-mode-button');
    const template = document.getElementById('window-template');

    // ÄNDERUNG: Wir suchen jetzt nach den "desk-objects" statt "nav-btn"
    // Der Editor-Button ist auch ein desk-object, den schließen wir hier aus
    const deskObjects = document.querySelectorAll('.desk-object:not(#editor-switch-container)');


    // State
    let isEditorMode = false;
    let windowOffset = 0;
    const activeWindows = {};

    // --- EDITOR MODE TOGGLE ---
    editorBtn.addEventListener('click', () => {
        isEditorMode = !isEditorMode;
        
        // UI Update Button (Retro Style)
        editorBtn.textContent = isEditorMode ? "EDIT MODE [ON]" : "EDIT MODE";
        editorBtn.classList.toggle('editing', isEditorMode);

        // UI Update Top Bar (CRT Style Inputs)
        toggleDisplay('mission-name-display', 'mission-name-input');
        toggleDisplay('takeoff-display', 'takeoff-inputs');

        document.querySelectorAll('.window-content').forEach(content => {
            content.contentEditable = isEditorMode;
        });
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
        } else {
            display.classList.remove('hidden');
            input.classList.add('hidden');
        }
    }

    // --- FENSTER LOGIK (Angepasst auf Desk Objects) ---
    deskObjects.forEach(obj => {
        obj.addEventListener('click', () => {
            // Das Ziel steht jetzt im 'data-target' Attribut des Hotspots
            const targetName = obj.getAttribute('data-target');

            if (activeWindows[targetName]) {
                closeWindow(targetName);
                return;
            }
            // Wir übergeben das Desk Object, damit wir es "aktiv" schalten können
            openWindow(targetName, obj);
        });
    });

    function openWindow(name, hotspotElement) {
        const clone = template.content.cloneNode(true);
        // ... (Rest der Funktion bleibt gleich wie vorher)
        const winFrame = clone.querySelector('.window-frame');
        const title = clone.querySelector('.window-title');
        const closeBtn = clone.querySelector('.win-close');
        const content = clone.querySelector('.window-content');
        const addTabBtn = clone.querySelector('.add-tab-btn');

        title.textContent = name.toUpperCase() + "_"; // Retro Unterstrich
        
        // Positionierung im CRT Screen
        winFrame.style.left = (10 + windowOffset) + 'px';
        winFrame.style.top = (10 + windowOffset) + 'px';
        winFrame.style.zIndex = 10 + windowOffset;
        
        content.contentEditable = isEditorMode;
        if (!isEditorMode) addTabBtn.classList.add('hidden');

        // Hotspot visuell aktivieren (z.B. gelber Rahmen bleibt)
        hotspotElement.classList.add('active-hotspot');

        windowOffset += 20; // Kleinerer Offset für den kleineren Screen
        if (windowOffset > 150) windowOffset = 0;

        closeBtn.onclick = () => closeWindow(name);
        winFrame.addEventListener('mousedown', () => {
            winFrame.style.zIndex = 999; 
        });

        makeDraggable(winFrame);

        mapArea.appendChild(winFrame);
        activeWindows[name] = { element: winFrame, hotspot: hotspotElement };
    }

    function closeWindow(name) {
        if (!activeWindows[name]) return;
        
        const winData = activeWindows[name];
        winData.element.remove();
        // Hotspot deaktivieren
        winData.hotspot.classList.remove('active-hotspot');
        
        delete activeWindows[name];
    }

    // --- DRAG AND DROP HELPER (Unverändert) ---
    function makeDraggable(element) {
        // (Der gleiche Code wie im vorherigen Schritt...)
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.window-header');
        if (header) { header.onmousedown = dragMouseDown; }
        function dragMouseDown(e) { e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY; document.onmouseup = closeDragElement; document.onmousemove = elementDrag; }
        function elementDrag(e) { e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY; element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px"; }
        function closeDragElement() { document.onmouseup = null; document.onmousemove = null; }
    }
});
