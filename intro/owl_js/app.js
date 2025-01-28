const { Component, xml, useState, mount, useSubEnv, useChildSubEnv, useEnv, useRef, useExternalListener, useComponent } = owl;

class Parent extends Component {
  static template = xml`
    <div>
      <h1>Parent Component</h1>
      <p>Shared Value: <t t-esc="sharedValue.value"/></p>
      <Child/>
    </div>`;

  sharedValue = useState({ value: 0 });

  constructor() {
    super(...arguments);
    useSubEnv({ sharedValue: this.sharedValue });
  }
}

class Child extends Component {
  static template = xml`
    <div>
      <h2>Child Component</h2>
      <p>Shared Value: <t t-esc="sharedValue.value"/></p>
      <button t-on-click="increment">Increment</button>
      <button t-on-click="logComponent">Log Component</button>
      <input t-ref="inputElement" type="text" placeholder="Type something..."/>
    </div>`;

  constructor() {
    super(...arguments);
    this.sharedValue = useChildSubEnv('sharedValue');
    this.inputElement = useRef('inputElement');
    this.env = useEnv();
    this.component = useComponent();
    useExternalListener(window, 'resize', this.onWindowResize);
  }

  increment() {
    this.sharedValue.value++;
  }

  logComponent() {
    console.log(this.component);
  }

  onWindowResize() {
    console.log('Window resized');
  }

  mounted() {
    console.log('Child component mounted');
    console.log('Input element:', this.inputElement.el);
  }
}

mount(Parent, document.body);
