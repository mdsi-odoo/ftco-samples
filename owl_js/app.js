
const { Component, xml, useState, mount } = owl;

class Counter extends Component {
  static template = xml`
    <button t-on-focus="increment">
      Click Me! [<t t-esc="state.value"/>]
    </button>`;

  state = useState({ value: 0 });

  increment() {
    this.state.value++;
  }
}
mount(Counter, document.body);
