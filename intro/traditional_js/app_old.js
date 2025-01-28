// Base Component class
class Component {
    constructor(props) {
        this.props = props; // Store props directly
        this.state = {}; // State object for component-specific state
        this.init(); // Initialize the component
    }

    init() {
        this.render(); // Render the component
    }

    // Render method to be implemented by subclasses
    render() {
        // To be implemented by subclasses
    }
}

// ComponentA class
class ComponentA extends Component {
    render() {
        // Create container for ComponentA
        const container = document.createElement('div');
        container.className = 'component';
        container.innerHTML = `
            <h2>Component A</h2>
            <input type="text" id="inputA" placeholder="Type something...">
            <button id="addButton">Add</button>
            <p id="noteStatus" style="color: grey;">Note cannot be empty</p>
        `;
        document.getElementById('app').appendChild(container);

        // Get references to DOM elements
        const inputA = container.querySelector('#inputA');
        const noteStatus = container.querySelector('#noteStatus');

        // Use Proxy to watch for changes in input value
        this.state = new Proxy(this.state, {
            set: (target, key, value) => {
                target[key] = value;
                if (key === 'note') {
                    if (value === '') {
                        noteStatus.textContent = 'Note cannot be empty';
                        noteStatus.style.color = 'grey';
                    } else if (value.length < 5) {
                        noteStatus.textContent = 'Note needs to be longer than 5 chars';
                        noteStatus.style.color = 'red';
                    } else {
                        noteStatus.textContent = 'Note is good';
                        noteStatus.style.color = 'green';
                    }
                }
                return true;
            }
        });

        // Bind input value to state
        inputA.oninput = () => {
            this.state.note = inputA.value;
        };

        // Bind button click to state change
        container.querySelector('#addButton').onclick = () => {
            if (this.state.note && this.state.note.length >= 5) {
                this.props.text = this.state.note;
            }
        };
    }
}

// ComponentB class
class ComponentB extends Component {
    render() {
        // Create container for ComponentB
        const container = document.createElement('div');
        container.className = 'component';
        container.innerHTML = `
            <h2>Component B</h2>
            <p id="outputB">${this.props.text}</p>
            <p><strong>Created At:</strong> ${this.props.createdAt}</p>
            <p><strong>Note ID:</strong> ${this.props.id}</p>
        `;
        document.getElementById('app').appendChild(container);
    }
}

// Create an instance of ComponentA
const componentA = new ComponentA({ text: '' });

// Use a proxy to watch for changes in the text property and create ComponentB instances
const appState = new Proxy({ notes: [] }, {
    set(target, key, value) {
        target[key] = value;
        if (key === 'notes') {
            value.forEach(note => {
                new ComponentB(note);
            });
        }
        return true;
    }
});

// Watch for changes in ComponentA's text property
componentA.props = new Proxy(componentA.props, {
    set(target, key, value) {
        target[key] = value;
        if (key === 'text' && value !== '') {
            const noteId = `note-${Date.now()}`; // Generate a unique note ID
            const createdAt = new Date().toLocaleString(); // Get the current date and time
            appState.notes = [...appState.notes, { text: value, id: noteId, createdAt: createdAt }];
        }
        return true;
    }
});
