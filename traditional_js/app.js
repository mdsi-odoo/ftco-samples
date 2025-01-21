// Base Component class
class Component {
    constructor(props) {
        this.props = props; // Store props directly
        this.state = {}; // State object for component-specific state
        this.events = {}; // Events object to store event listeners
        this.init(); // Initialize the component
    }

    init() {
        this.render(); // Render the component
    }

    // Render method to be implemented by subclasses
    render() {
        // To be implemented by subclasses
    }

    // Add an event listener
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    // Trigger an event
    triggerEvent(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }

    // Method to remove the component from the DOM and clean up event listeners
    remove() {
        if (this.container) {
            this.container.remove();
        }
    }
}

// ComponentA class
class ComponentA extends Component {
    render() {
        // Create container for ComponentA
        this.container = document.createElement('div');
        this.container.className = 'component';
        this.container.innerHTML = `
            <h2>Component A</h2>
            <input type="text" id="inputA" placeholder="Type something...">
            <button id="addButton">Add</button>
            <p id="noteStatus" style="color: grey;">Note cannot be empty</p>
        `;
        document.getElementById('app').appendChild(this.container);

        // Get references to DOM elements
        this.inputA = this.container.querySelector('#inputA');
        this.noteStatus = this.container.querySelector('#noteStatus');
        this.addButton = this.container.querySelector('#addButton');

        // Attach event listeners
        this.handleInput = this.handleInput.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.inputA.addEventListener('input', this.handleInput);
        this.addButton.addEventListener('click', this.handleAdd);
    }

    handleInput() {
        const note = this.inputA.value;
        if (note === '') {
            this.noteStatus.textContent = 'Note cannot be empty';
            this.noteStatus.style.color = 'grey';
        } else if (note.length < 5) {
            this.noteStatus.textContent = 'Note needs to be longer than 5 chars';
            this.noteStatus.style.color = 'red';
        } else {
            this.noteStatus.textContent = 'Note is good';
            this.noteStatus.style.color = 'green';
        }
    }

    handleAdd() {
        const note = this.inputA.value;
        if (note !== '' && note.length >= 5) {
            this.props.text = note;
            this.triggerEvent('addNote', note);
        }
    }

    // Method to remove the component from the DOM and clean up event listeners
    remove() {
        this.inputA.removeEventListener('input', this.handleInput);
        this.addButton.removeEventListener('click', this.handleAdd);
        super.remove();
    }
}

// ComponentB class
class ComponentB extends Component {
    render() {
        // Create container for ComponentB
        this.container = document.createElement('div');
        this.container.className = 'component';
        this.container.innerHTML = `
            <h2>Component B</h2>
            <p id="outputB">${this.props.text}</p>
            <p><strong>Created At:</strong> ${this.props.createdAt}</p>
            <p><strong>Note ID:</strong> ${this.props.id}</p>
        `;
        document.getElementById('app').appendChild(this.container);
    }
}

// Create an instance of ComponentA
const componentA = new ComponentA({ text: '' });

// Add event listener for 'addNote' event
componentA.on('addNote', (note) => {
    const noteId = `note-${Date.now()}`; // Generate a unique note ID
    const createdAt = new Date().toLocaleString(); // Get the current date and time
    new ComponentB({ text: note, id: noteId, createdAt: createdAt }); // Create a new instance of ComponentB with the note
});
