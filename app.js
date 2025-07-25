// Journal App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initializeJournal();
});

// HTML Sanitization function to prevent XSS
function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

// Safe HTML insertion function
function safeSetInnerHTML(element, html) {
    if (element) {
        // For contenteditable areas, we need to be more careful
        // Only allow basic formatting and images
        const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'img', 'div', 'span'];
        const allowedAttributes = ['src', 'alt', 'style', 'class'];
        
        // Create a temporary div to parse the HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Remove any script tags and dangerous attributes
        const scripts = temp.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        
        // Clean up any dangerous attributes
        const allElements = temp.querySelectorAll('*');
        allElements.forEach(el => {
            const attributes = Array.from(el.attributes);
            attributes.forEach(attr => {
                if (!allowedAttributes.includes(attr.name) || 
                    attr.name.startsWith('on') || 
                    attr.value.includes('javascript:')) {
                    el.removeAttribute(attr.name);
                }
            });
        });
        
        element.innerHTML = temp.innerHTML;
    }
}

function initializeJournal() {
    // Get DOM elements
    const editor = document.getElementById('editor');
    const saveBtn = document.getElementById('save-btn');
    const titleInput = document.getElementById('entry-title');
    const moodSelect = document.getElementById('entry-mood');
    const fontFamilySelect = document.getElementById('font-family');
    const fontSizeSelect = document.getElementById('font-size');
    const fontColorInput = document.getElementById('font-color');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const imageUpload = document.getElementById('image-upload');
    const editorImages = document.getElementById('editor-images');
    const wordCount = document.getElementById('word-count');
    const showTrashBtn = document.getElementById('show-trash-btn');

    // Initialize word count
    updateWordCount();

    // Event listeners
    if (saveBtn) saveBtn.addEventListener('click', saveEntry);
    if (editor) {
        editor.addEventListener('input', updateWordCount);
        editor.addEventListener('paste', handlePaste);
    }
    if (titleInput) titleInput.addEventListener('input', updateWordCount);
    if (fontFamilySelect) fontFamilySelect.addEventListener('change', applyFontFamily);
    if (fontSizeSelect) fontSizeSelect.addEventListener('change', applyFontSize);
    if (fontColorInput) fontColorInput.addEventListener('change', applyFontColor);
    if (boldBtn) boldBtn.addEventListener('click', toggleBold);
    if (italicBtn) italicBtn.addEventListener('click', toggleItalic);
    if (underlineBtn) underlineBtn.addEventListener('click', toggleUnderline);
    if (imageUpload) imageUpload.addEventListener('change', handleImageUpload);
    if (showTrashBtn) showTrashBtn.addEventListener('click', showTrash);

    // Load existing entries if on entries page
    if (window.location.pathname.includes('entries.html')) {
        loadEntries();
    }

    // Load calendar if on calendar page
    if (window.location.pathname.includes('calendar.html')) {
        // Calendar functionality is handled in calendar.html
    }
}

function updateWordCount() {
    const editor = document.getElementById('editor');
    const titleInput = document.getElementById('entry-title');
    const wordCount = document.getElementById('word-count');
    
    if (!editor || !wordCount) return;

    const editorText = editor.innerText || editor.textContent || '';
    const titleText = titleInput ? (titleInput.value || '') : '';
    const totalText = titleText + ' ' + editorText;
    const words = totalText.trim().split(/\s+/).filter(word => word.length > 0);
    
    wordCount.textContent = `${words.length} words`;
}

function applyFontFamily() {
    const fontFamilySelect = document.getElementById('font-family');
    const editor = document.getElementById('editor');
    
    if (!fontFamilySelect || !editor) return;
    
    const selectedFont = fontFamilySelect.value;
    
    // Modern approach using selection API
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            // Apply to selected text
            const span = document.createElement('span');
            span.style.fontFamily = selectedFont;
            range.surroundContents(span);
        } else {
            // Apply to current position
            document.execCommand('fontName', false, selectedFont);
        }
    } else {
        // Fallback to execCommand
        document.execCommand('fontName', false, selectedFont);
    }
    editor.focus();
}

function applyFontSize() {
    const fontSizeSelect = document.getElementById('font-size');
    const editor = document.getElementById('editor');
    
    if (!fontSizeSelect || !editor) return;
    
    const selectedSize = fontSizeSelect.value;
    
    // Modern approach using selection API
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            // Apply to selected text
            const span = document.createElement('span');
            span.style.fontSize = selectedSize;
            range.surroundContents(span);
        } else {
            // Apply to current position
            document.execCommand('fontSize', false, selectedSize);
        }
    } else {
        // Fallback to execCommand
        document.execCommand('fontSize', false, selectedSize);
    }
    editor.focus();
}

function applyFontColor() {
    const fontColorInput = document.getElementById('font-color');
    const editor = document.getElementById('editor');
    
    if (!fontColorInput || !editor) return;
    
    const selectedColor = fontColorInput.value;
    
    // Modern approach using selection API
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            // Apply to selected text
            const span = document.createElement('span');
            span.style.color = selectedColor;
            range.surroundContents(span);
        } else {
            // Apply to current position
            document.execCommand('foreColor', false, selectedColor);
        }
    } else {
        // Fallback to execCommand
        document.execCommand('foreColor', false, selectedColor);
    }
    editor.focus();
}

function toggleBold() {
    const editor = document.getElementById('editor');
    if (!editor) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            // Apply to selected text
            const strong = document.createElement('strong');
            range.surroundContents(strong);
        } else {
            // Apply to current position
            document.execCommand('bold', false, null);
        }
    } else {
        // Fallback to execCommand
        document.execCommand('bold', false, null);
    }
    editor.focus();
}

function toggleItalic() {
    const editor = document.getElementById('editor');
    if (!editor) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            // Apply to selected text
            const em = document.createElement('em');
            range.surroundContents(em);
        } else {
            // Apply to current position
            document.execCommand('italic', false, null);
        }
    } else {
        // Fallback to execCommand
        document.execCommand('italic', false, null);
    }
    editor.focus();
}

function toggleUnderline() {
    const editor = document.getElementById('editor');
    if (!editor) return;
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            // Apply to selected text
            const u = document.createElement('u');
            range.surroundContents(u);
        } else {
            // Apply to current position
            document.execCommand('underline', false, null);
        }
    } else {
        // Fallback to execCommand
        document.execCommand('underline', false, null);
    }
    editor.focus();
}

function handleImageUpload(event) {
    const files = event.target.files;
    const editorImages = document.getElementById('editor-images');
    
    if (!editorImages) return;

    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '200px';
                img.style.maxHeight = '200px';
                img.style.margin = '5px';
                img.style.borderRadius = '8px';
                img.style.cursor = 'pointer';
                
                img.addEventListener('click', function() {
                    // Insert image into editor
                    const editor = document.getElementById('editor');
                    if (editor) {
                        const imgElement = document.createElement('img');
                        imgElement.src = e.target.result;
                        imgElement.style.maxWidth = '100%';
                        imgElement.style.height = 'auto';
                        imgElement.style.margin = '10px 0';
                        imgElement.style.borderRadius = '8px';
                        imgElement.style.display = 'block';
                        imgElement.alt = 'Journal image'; // Add alt text for accessibility
                        
                        // Insert at cursor position
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            range.insertNode(imgElement);
                            range.collapse(false);
                        } else {
                            editor.appendChild(imgElement);
                        }
                        editor.focus();
                        
                        // Clear the preview images
                        editorImages.innerHTML = '';
                        
                        // Update word count
                        updateWordCount();
                    }
                });
                
                editorImages.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

function handlePaste(event) {
    // Allow rich text pasting but sanitize it
    const clipboardData = event.clipboardData;
    if (clipboardData.types.includes('text/html')) {
        event.preventDefault();
        const html = clipboardData.getData('text/html');
        // Sanitize the HTML before inserting
        const sanitizedHTML = sanitizeHTML(html);
        document.execCommand('insertHTML', false, sanitizedHTML);
    } else if (clipboardData.types.includes('text/plain')) {
        event.preventDefault();
        const text = clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }
    // If it's an image, let the default behavior handle it
}

function saveEntry() {
    try {
        const editor = document.getElementById('editor');
        const titleInput = document.getElementById('entry-title');
        const moodSelect = document.getElementById('entry-mood');
        
        if (!editor || !titleInput) {
            showNotification('Error: Required elements not found', 'error');
            return;
        }

        const title = titleInput.value.trim();
        const content = editor.innerHTML;
        const mood = moodSelect ? moodSelect.value : '';
        
        if (!title && !content.trim()) {
            showNotification('Please add a title or some content before saving.', 'error');
            return;
        }

        // Extract images from the editor content - IMPROVED LOGIC
        const images = [];
        const imgElements = editor.querySelectorAll('img');
        console.log('Found img elements in editor:', imgElements.length);
        imgElements.forEach(img => {
            // Check for both data URLs and any valid image source
            if (img.src && (img.src.startsWith('data:') || img.src.startsWith('blob:') || img.src.startsWith('http'))) {
                images.push(img.src);
                console.log('Added image:', img.src.substring(0, 50) + '...');
            }
        });
        console.log('Total images extracted:', images.length);

        // Get current date in local timezone (simpler approach)
        const today = new Date();
        const dateString = today.getFullYear() + '-' + 
                          String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(today.getDate()).padStart(2, '0');
        
        const entry = {
            id: Date.now(),
            title: title || 'Untitled Entry',
            content: content,
            mood: mood,
            images: images,
            date: dateString,
            timestamp: new Date().toISOString()
        };

        // Get existing entries
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        entries.unshift(entry); // Add new entry at the beginning
        
        // Save to localStorage
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        
        // Clear the form
        titleInput.value = '';
        editor.innerHTML = '';
        const editorImages = document.getElementById('editor-images');
        if (editorImages) editorImages.innerHTML = '';
        updateWordCount();
        
        // Show success message
        showNotification('Entry saved successfully!', 'success');
        
        // Refresh timeline if on entries page
        if (window.location.pathname.includes('entries.html')) {
            loadEntries();
        }
        
        // Refresh calendar if on calendar page
        if (window.location.pathname.includes('calendar.html')) {
            // Trigger calendar re-render
            if (typeof renderCalendar === 'function' && typeof currentDate !== 'undefined') {
                renderCalendar(currentDate);
            }
        }
    } catch (error) {
        showNotification('Error saving entry: ' + error.message, 'error');
        console.error('Save entry error:', error);
    }
}

function loadEntries() {
    const entriesList = document.getElementById('entries-list');
    const searchForm = document.getElementById('search-form');
    const searchKeyword = document.getElementById('search-keyword');
    const searchMood = document.getElementById('search-mood');
    
    if (!entriesList) return;

    function displayEntries(entries) {
        entriesList.innerHTML = '';
        
        if (entries.length === 0) {
            entriesList.innerHTML = '<p style="text-align: center; color: #666; margin: 2rem;">No entries found.</p>';
            return;
        }

        entries.forEach(entry => {
            const entryCard = document.createElement('div');
            entryCard.className = 'entry-card timeline-card';
            entryCard.style.cursor = 'pointer';
            
            // Get first line of content only (preserve images)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = entry.content || '';
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            const firstLine = textContent.split('\n')[0].substring(0, 100);
            const displayContent = firstLine.length >= 100 ? firstLine + '...' : firstLine;
            
            // Debug: Log entry images
            console.log('Displaying entry:', entry.title, 'Images:', entry.images);
            
            entryCard.innerHTML = `
                <div class="entry-header">
                    <h3>${entry.title}</h3>
                    <span class="entry-date">${formatDate(entry.date)}</span>
                    ${entry.mood ? `<span class="entry-mood">${entry.mood}</span>` : ''}
                </div>
                <div class="entry-content">${displayContent}</div>
                ${entry.images && entry.images.length > 0 ? `
                <div style="margin-top: 1rem; padding: 0.5rem; background: #f8f4f0; border-radius: 8px; border: 1px solid #e2b4a6;">
                    <div style="font-size: 0.9rem; color: #7b5e57; margin-bottom: 0.5rem; font-weight: 600;">📸 Images (${entry.images.length})</div>
                    <div style="display: flex; gap: 0.5rem; overflow-x: auto; padding: 0.5rem 0;">
                        ${entry.images.slice(0, 3).map(imgSrc => `
                            <img src="${imgSrc}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 2px solid #e2b4a6; box-shadow: 0 2px 8px rgba(120, 90, 70, 0.2);" onerror="this.style.display='none'; console.log('Image failed to load:', imgSrc);" alt="Entry image">
                        `).join('')}
                        ${entry.images.length > 3 ? `<div style="width: 80px; height: 80px; background: #e2b4a6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #4e342e; font-size: 0.8rem; font-weight: bold; border: 2px solid #e2b4a6;">+${entry.images.length - 3}</div>` : ''}
                    </div>
                </div>
                ` : ''}
            `;
            
            // Add click event to show full entry in modal
            entryCard.addEventListener('click', function() {
                showEntryModal(entry);
            });
            
            entriesList.appendChild(entryCard);
        });
    }

    // Load and display all entries
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    displayEntries(entries);

    // Search functionality
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const keyword = searchKeyword.value.toLowerCase();
            const mood = searchMood.value;
            
            let filteredEntries = entries;
            
            if (keyword) {
                filteredEntries = filteredEntries.filter(entry => 
                    entry.title.toLowerCase().includes(keyword) || 
                    entry.content.toLowerCase().includes(keyword)
                );
            }
            
            if (mood) {
                filteredEntries = filteredEntries.filter(entry => entry.mood === mood);
            }
            
            displayEntries(filteredEntries);
        });
    }
}

function showEntryModal(entry) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('entry-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'entry-modal';
        modal.className = 'modal hidden';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(120, 90, 70, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(2px);
        `;
        document.body.appendChild(modal);
    }

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: #fffaf6;
        padding: 2.5rem;
        border-radius: 18px;
        width: 90%;
        max-width: 800px;
        max-height: 85vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 8px 32px rgba(120, 90, 70, 0.15);
        border: 2px solid #e2b4a6;
        font-family: 'Quicksand', sans-serif;
    `;

    // Display content with images preserved
    const contentWithImages = entry.content || '';
    // console.log('Entry images:', entry.images);
    // console.log('Entry content:', entry.content);
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 2px solid #e2b4a6; padding-bottom: 1rem;">
            <h2 style="margin: 0; color: #4e342e; font-family: 'Pacifico', cursive; font-size: 2.2rem;">${entry.title}</h2>
            <button onclick="closeEntryModal()" style="background: #e2b4a6; border: none; font-size: 1.8rem; cursor: pointer; color: #4e342e; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">&times;</button>
        </div>
        <div style="margin-bottom: 1.5rem; color: #7b5e57; font-size: 1rem; background: #f8f4f0; padding: 1rem; border-radius: 12px; border-left: 4px solid #e2b4a6;">
            <span style="font-weight: 600;">📅 ${formatDate(entry.date)}</span>
            ${entry.mood ? `<span style="margin-left: 1.5rem; font-weight: 600;">${entry.mood}</span>` : ''}
        </div>
        <div style="line-height: 1.8; margin-bottom: 2.5rem; color: #4e342e; font-size: 1.1rem; background: #fff; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2b4a6; min-height: 200px; overflow-wrap: break-word;">
            ${contentWithImages}
        </div>
        ${entry.images && entry.images.length > 0 ? `
        <div style="margin-bottom: 2rem; padding: 1rem; background: #f8f4f0; border-radius: 12px; border: 1px solid #e2b4a6;">
            <h3 style="margin: 0 0 1rem 0; color: #4e342e; font-family: 'Pacifico', cursive;">📸 Images</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
                ${entry.images.map(imgSrc => `
                    <img src="${imgSrc}" style="max-width: 200px; max-height: 200px; border-radius: 12px; border: 2px solid #e2b4a6; object-fit: cover; box-shadow: 0 4px 12px rgba(120, 90, 70, 0.2);">
                `).join('')}
            </div>
        </div>
        ` : ''}
        <div style="text-align: right; border-top: 2px solid #e2b4a6; padding-top: 1.5rem;">
            <button onclick="deleteEntryFromModal(${entry.id})" style="background: linear-gradient(135deg, #a97c50, #8b6b47); color: white; border: none; padding: 12px 24px; border-radius: 25px; cursor: pointer; font-family: 'Quicksand', sans-serif; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 15px rgba(169, 124, 80, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px;">🗑️ Move to Trash</button>
        </div>
    `;

    modal.innerHTML = '';
    modal.appendChild(modalContent);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeEntryModal() {
    const modal = document.getElementById('entry-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function deleteEntryFromModal(id) {
    if (confirm('Are you sure you want to move this entry to trash?')) {
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        const entryToDelete = entries.find(entry => entry.id === id);
        
        if (entryToDelete) {
            // Move to trash instead of deleting permanently
            const trash = JSON.parse(localStorage.getItem('trashEntries') || '[]');
            entryToDelete.deletedAt = new Date().toISOString();
            trash.unshift(entryToDelete);
            localStorage.setItem('trashEntries', JSON.stringify(trash));
            
            // Remove from main entries
            const updatedEntries = entries.filter(entry => entry.id !== id);
            localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
            
            closeEntryModal();
            loadEntries();
            showNotification('Entry moved to trash!', 'success');
        }
    }
}

function showTrash() {
    const trash = JSON.parse(localStorage.getItem('trashEntries') || '[]');
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('trash-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'trash-modal';
        modal.className = 'modal hidden';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        document.body.appendChild(modal);
    }

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;

    if (trash.length === 0) {
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="margin: 0; color: #4e342e; font-family: 'Pacifico', cursive;">Trash</h2>
                <button onclick="closeTrashModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
            <p style="text-align: center; color: #666; margin: 2rem;">No entries in trash.</p>
        `;
    } else {
        let trashHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h2 style="margin: 0; color: #4e342e; font-family: 'Pacifico', cursive;">Trash (${trash.length})</h2>
                <button onclick="closeTrashModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
            </div>
        `;

                 trash.forEach(entry => {
             const deletedDate = new Date(entry.deletedAt).toLocaleDateString();
             const tempDiv = document.createElement('div');
             tempDiv.innerHTML = entry.content || '';
             const textContent = tempDiv.textContent || tempDiv.innerText || '';
             const content = textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');
            
            trashHTML += `
                <div style="border: 1px solid #eee; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h3 style="margin: 0; color: #4e342e;">${entry.title}</h3>
                        <div style="text-align: right; font-size: 0.8rem; color: #666;">
                            <div>Deleted: ${deletedDate}</div>
                            <div>Created: ${formatDate(entry.date)}</div>
                        </div>
                    </div>
                    <p style="color: #666; margin-bottom: 1rem;">${content}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="restoreEntry(${entry.id})" style="background: #28a745; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">Restore</button>
                        <button onclick="permanentlyDeleteEntry(${entry.id})" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.9rem;">Delete Permanently</button>
                    </div>
                </div>
            `;
        });

        modalContent.innerHTML = trashHTML;
    }

    modal.innerHTML = '';
    modal.appendChild(modalContent);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTrashModal() {
    const modal = document.getElementById('trash-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function restoreEntry(id) {
    const trash = JSON.parse(localStorage.getItem('trashEntries') || '[]');
    const entryToRestore = trash.find(entry => entry.id === id);
    
    if (entryToRestore) {
        // Remove from trash
        const updatedTrash = trash.filter(entry => entry.id !== id);
        localStorage.setItem('trashEntries', JSON.stringify(updatedTrash));
        
        // Add back to main entries
        const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        delete entryToRestore.deletedAt; // Remove the deletedAt property
        entries.unshift(entryToRestore);
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        
        showNotification('Entry restored successfully!', 'success');
        showTrash(); // Refresh the trash modal
    }
}

function permanentlyDeleteEntry(id) {
    if (confirm('Are you sure you want to permanently delete this entry? This action cannot be undone.')) {
        const trash = JSON.parse(localStorage.getItem('trashEntries') || '[]');
        const updatedTrash = trash.filter(entry => entry.id !== id);
        localStorage.setItem('trashEntries', JSON.stringify(updatedTrash));
        
        showNotification('Entry permanently deleted!', 'success');
        showTrash(); // Refresh the trash modal
    }
}



function formatDate(dateString) {
    // Handle date string in YYYY-MM-DD format
    if (dateString && dateString.includes('-')) {
        const [year, month, day] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Fallback for other date formats
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const bgColor = type === 'success' ? '#4CAF50' : 
                   type === 'error' ? '#f44336' : 
                   type === 'warning' ? '#ff9800' : '#2196F3';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        background: ${bgColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check if we're editing an entry
window.addEventListener('load', function() {
    const editingEntry = localStorage.getItem('editingEntry');
    if (editingEntry) {
        const entry = JSON.parse(editingEntry);
        const titleInput = document.getElementById('entry-title');
        const editor = document.getElementById('editor');
        
        if (titleInput && editor) {
            titleInput.value = entry.title;
            editor.innerHTML = entry.content;
            updateWordCount();
            
            // Clear the editing entry from localStorage
            localStorage.removeItem('editingEntry');
        }
    }
}); 

 