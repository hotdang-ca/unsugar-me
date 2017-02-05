/*
 * Why did I do this all inline?
 * I haven't figured out how to combine
 * Lumen and React(Node) together.
 * Laravel is in bed with Vue,
 * and I'm not a fan of Vue, so
 * This is how we do this for small little apps like this.
 * - James Perih, February 2017 james@hotdang.ca
 */

const Calculator = React.createClass({
  getInitialState: function() {
    return {
      grams: 0,
      answer: 0,
    };
  },

  onInputChange: function(e) {
    const grams = e.target.value;
    this.renderGramsToPercentage(grams || 0);
    this.setState({
      grams
    });
  },

  renderGramsToPercentage(grams) {
    if (!grams) {
      return;
    }

    axios.get(`/api/v1/convert/${grams}/to_percent`).then((response) => {
      this.setState({
        answer: response.data.sugar.percentage
      });
    });
  },

  render: function() {
    return (
      <div className="panel">
        <div className="input">
          <input type="number" placeholder="enter the grams of sugar per portion, found on the product nutritional label" onChange={this.onInputChange} />
        </div>

        <div className="answer">
          <div id="answerPrefix">{`${this.state.grams} grams of sugar is`}</div>
          <div id="answer">{ `${this.state.answer * 100}%`}</div>
          <div id="rdi">of your recommended daily intake of sugar, based on the average daily calorie consumption of a human</div>
        </div>
      </div>
    );
  }
});

const Share = React.createClass({
  getInitialState: function() {
    return {
      email: undefined,
      brand: undefined,
      per: undefined,
      units: undefined,
      submitted: false,
    }
  },

  onBrandChanged(e) {
    this.setState({
      brand: e.target.value
    });
  },

  onPerChanged(e) {
    this.setState({
      per: e.target.value
    });
  },

  onUnitsChanged(e) {
    this.setState({
      units: e.target.value
    })
  },

  onShareClicked(e) {
    const {brand, per, units} = this.state;
    console.log(`${brand} ${per} ${units}`);
    axios.get(`/api/v1/save/${brand}/${per}/${units}`).then(response => {
      this.setState({
        submitted: true
      });
    }).catch(error => {
      console.log("some sort of error, ", error);
    });
  },

  emailMe: function() {
    window.open('mailto:james@hotdang.ca?subject=Un-Sugar%20Me');
  },

  renderButton: function() {
    return (!this.state.submitted
      ? <button onClick={this.onShareClicked} className="saveAndShare" id="shareButton">Share This Sugar Sin!</button>
      : <button onClick={this.emailMe} className="saveAndShare" id="emailButton">Thanks! Tap to contact me.</button>
    );
  },

  render: function() {
    return (
      <div className="details">
        <em>Care to share what this was?</em><br/>
        <input
          id="brand"
          placeholder="brand"
          className="smaller"
          onChange={this.onBrandChanged}
        />

        &nbsp;per

        <input
          onChange={this.onPerChanged}
          id="per" type="number"
          placeholder="how many"
          className="smaller"
        />
        &nbsp;
        <input
          onChange={this.onUnitsChanged}
          id="units"
          placeholder="units"
          className="smaller"
        />

        <div id="example">
          <strong>Eg:</strong>&nbsp;
          <input readOnly placeholder="Chocolate Bar" className="smallest"></input>
          &nbsp;per <input readOnly id="per" type="number" placeholder="355" className="smallest"></input>
          &nbsp;<input readOnly placeholder="mL" className="smallest"></input>
        </div>

        {this.renderButton()}

        <br/><em className="shareDisclaimer">We will post to our Facebook page on your behalf. Do not leave any personally-idenfiable information.</em>
      </div>
    );
  }
});

const Wrapper = React.createClass({
  render: function() {
    return (
      <div>
        <div className="header">
          <h1>Un-Sugar.me</h1>
        </div>

        <div className="subtitle">
          <h3>Convert grams of sugar<br/>to % of daily intake</h3>
        </div>

        <div className="calculator">
          <Calculator />
        </div>

        <div className="share">
          <Share />
        </div>
      </div>);
  }
});

ReactDOM.render(
  <Wrapper />,
  document.getElementById('reactRoot')
);
