document.addEventListener('DOMContentLoaded', () => {
    // --- KONFIGURATION ---
    const mapArea = document.getElementById('map-area'); 
    const template = document.getElementById('window-template');

    // Selektiere alle Hotspots außer dem Editor-Switch
    const contentHotspots = document.querySelectorAll('.desk-object:not(#editor-switch-container)');
    const editorHotspot = document.getElementById('editor-switch-container');

    // State
    let isEditorMode = false;
    let windowOffset = 0;
    const activeWindows = {};

    // --- EDITOR MODE LOGIK ---
    // Klick auf das Telefon (oder was auch immer der Editor Hotspot ist)
    editorHotspot.addEventListener('click', () => {
        isEditorMode = !isEditorMode;
        
        // Visuelles Feedback im Monitor (System Status oben rechts)
        const statusEl = document.querySelector('.system-status');
        if (statusEl) {
            statusEl.textContent = isEditorMode ? "EDIT_MODE_ACTIVE" : "READY_";
            statusEl.style.color = isEditorMode ? "orange" : "";
        }

        // Eingabefelder umschalten
        toggleDisplay('mission-name-display', 'mission-name-input');
        toggleDisplay('takeoff-display', 'takeoff-inputs');

        // Fenster Inhalte editierbar machen
        document.querySelectorAll('.window-content').forEach(content => {
            content.contentEditable = isEditorMode;
        });
        
        // Plus-Buttons für Tabs zeigen
        document.querySelectorAll('.add-tab-btn').forEach(btn => {
            btn.classList.toggle('hidden', !isEditorMode);
        });

        console.log("Editor Mode:", isEditorMode); // Debug
    });

    function toggleDisplay(displayId, inputId) {
        const display = document.getElementById(displayId);
        const input = document.getElementById(inputId);
        if(!display || !input) return;

        if (isEditorMode) {
            display.classList.add('hidden');
            input.classList.remove('hidden');
            // Hier könnte man Werte kopieren
            if(display.textContent !== "UNDEFINED" && display.textContent !== "--:--Z") {
                // Logik zum Wert übernehmen könnte hier rein
            }
        } else {
            display.classList.remove('hidden');
            input.classList.add('hidden');
            // Wert zurückschreiben bei Deaktivierung
            if(input.value) display.textContent = input.value;
        }
    }

    // --- FENSTER ÖFFNEN LOGIK ---
    contentHotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const targetName = hotspot.getAttribute('data-target');
            
            // Wenn Fenster schon offen, schließen
            if (activeWindows[targetName]) {
                closeWindow(targetName);
                return;
            }
            
            openWindow(targetName);
        });
    });

    function openWindow(name) {
        const clone = template.content.cloneNode(true);
        const winFrame = clone.querySelector('.window-frame');
        const title = clone.querySelector('.window-title');
        const closeBtn = clone.querySelector('.win-close');
        const content = clone.querySelector('.window-content');
        const addTabBtn = clone.querySelector('.add-tab-btn');

        title.textContent = name.toUpperCase();
        
        // Positionierung im Monitor (versetzt)
        winFrame.style.left = (10 + windowOffset) + 'px';
        winFrame.style.top = (10 + windowOffset) + 'px';
        winFrame.style.zIndex = 100 + windowOffset;
        
        content.contentEditable = isEditorMode;
        if (!isEditorMode) addTabBtn.classList.add('hidden');

        // Offset erhöhen
        windowOffset += 20;
        if (windowOffset > 100) windowOffset = 0;

        // Schließen Funktion
        closeBtn.onclick = () => closeWindow(name);
        
        // Nach vorne holen bei Klick
        winFrame.addEventListener('mousedown', () => {
            // Einfacher Z-Index Hack
            winFrame.style.zIndex = 999; 
        });

        makeDraggable(winFrame);
        mapArea.appendChild(winFrame);
        activeWindows[name] = { element: winFrame };
    }

    function closeWindow(name) {
        if (!activeWindows[name]) return;
        activeWindows[name].element.remove();
        delete activeWindows[name];
    }

    // --- DRAG FUNKTION (Verschieben der Fenster) ---
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('.window-header');
        
        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});
