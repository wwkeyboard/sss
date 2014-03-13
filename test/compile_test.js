var assert = require('assert'),
    parser = require('../lib/parser').parser

describe('Compilation to CSS', function() {
  it('compiles empty rule', function () {
    var code = heredoc(function(){/*
h1 {  }
p {  }
*/})

    assert.equal(parser.parse(code).toCSS(), code)
  })

  it('compiles properties', function () {
    var code = 'h1 { font-size: 10px; padding: 10px 20px; }'
    assert.equal(parser.parse(code).toCSS(), code)
  })

  it('compiles nested rules', function () {
      var code = heredoc(function(){/*
h1 {
  p { font-size: 10px; }
}
*/});

    assert.equal(parser.parse(code).toCSS(), heredoc(function() {/*
h1 {  }
h1 p { font-size: 10px; }
*/}));
  })

  it('compiles variables', function() {
    assert.equal(parser.parse("p { @a: 10px; width: @a; }").toCSS(),
                              "p { width: 10px; }")
  })

  it('compiles variables from parent scopes', function() {
    var code = heredoc(function(){/*
@a: 10px;
p { width: @a; }
*/})

    assert.equal(parser.parse(code).toCSS(),
                              "p { width: 10px; }")
  })

  // Helpers

  // http://stackoverflow.com/questions/4376431/javascript-heredoc
  function heredoc(f) {
    return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
  };
})
