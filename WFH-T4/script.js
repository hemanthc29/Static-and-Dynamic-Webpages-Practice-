document.addEventListener('DOMContentLoaded', () => {
    const taskLinks = document.querySelectorAll('.task-link');
    const taskTitle = document.getElementById('task-title');
    const previewFrame = document.getElementById('preview-frame');
    const openTabBtn = document.getElementById('open-tab');
    const codeDisplay = document.getElementById('code-display');
    const codeTabs = document.querySelectorAll('.code-tab');
    const vpBtns = document.querySelectorAll('.vp-btn');
    const searchInput = document.getElementById('search-input');
    const moduleGroups = document.querySelectorAll('.module-group');

    let activeTaskId = '1';
    let activeTab = 'html';
    let cache = {};

    function updateView() {
        const activeLink = document.querySelector(`.task-link[data-id="${activeTaskId}"]`);
        if (!activeLink) return;

        taskTitle.textContent = activeLink.textContent;
        const pageUrl = `tasks/task${activeTaskId}.html`;
        previewFrame.src = pageUrl;
        openTabBtn.href = pageUrl;

        fetchCode(activeTaskId);
    }

    async function fetchCode(id) {
        const htmlUrl = `tasks/task${id}.html`;
        const cssUrl = `tasks/task${id}.css`;

        if (!cache[id]) {
            try {
                const [htmlRes, cssRes] = await Promise.all([
                    fetch(htmlUrl).then(r => r.text()),
                    fetch(cssUrl).then(r => r.text())
                ]);
                cache[id] = { html: htmlRes, css: cssRes };
            } catch (err) {
                cache[id] = { html: 'Error loading source code.', css: 'Error loading source code.' };
            }
        }

        renderCode();
    }

    function renderCode() {
        const data = cache[activeTaskId];
        if (!data) return;

        let codeText = activeTab === 'html' ? data.html : data.css;
        codeDisplay.textContent = codeText;
        codeDisplay.className = activeTab === 'html' ? 'language-html' : 'language-css';
    }

    taskLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            taskLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            activeTaskId = link.getAttribute('data-id');
            updateView();
        });
    });

    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            codeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeTab = tab.getAttribute('data-tab');
            renderCode();
        });
    });

    vpBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            vpBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetWidth = btn.getAttribute('data-width');
            previewFrame.style.width = targetWidth;
        });
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        moduleGroups.forEach(group => {
            const links = group.querySelectorAll('.task-link');
            let hasVisibleLink = false;

            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                if (text.includes(query)) {
                    link.style.display = 'block';
                    hasVisibleLink = true;
                } else {
                    link.style.display = 'none';
                }
            });

            if (hasVisibleLink || query === '') {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
    });

    updateView();
});
