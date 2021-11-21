snake.size = function(settings = {}) {
  settings.lightSquares = settings.lightSquares || (settings.dark ? '#47404F' : '#AAD751');
  settings.darkSquares  = settings.darkSquares  || (settings.dark ? '#423C49' : '#A2D149');
  settings.width        = settings.width        || 40;
  settings.height       = settings.height       || 40;
  let squareSize = 600 / settings.width;
  if(squareSize * settings.height > 530)
    squareSize = 530 / settings.height;
  squareSize = ~~(squareSize * .95);

  const scripts = document.getElementsByTagName('script');
  for(let script of scripts) {
    const req = new XMLHttpRequest();
    req.open('GET', script.src);
    req.onload = function() {
      const code = this.responseText;
      if(code.indexOf('#A2') === -1)
        return;

      const icon = new Image();
      icon.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png';
      icon.width = 47;
      icon.height = 47;
      if(document.querySelector('#size').childElementCount > 3)
        for(let i = document.querySelector('#size').childElementCount - 1; i >= 3; i--)
          document.querySelector('#size').removeChild(document.querySelector('#size').children[i]);
      document.querySelector('#size').appendChild(icon);
      
      const c = code.match(
        /[a-zA-Z0-9_$]{1,8}\.prototype\.[a-zA-Z0-9_$]{1,8}=function\(\){var a=this,b=[^]*?canvas[^]*?\);return b\.promise}/
      )[0];
      const wa = c.match(
        /a\.[a-zA-Z0-9_$]{1,8}\/128/
      )[0].replace('/128', '');
      const size = code.match(
        /1===this\.[a-zA-Z0-9_$]{1,8}\|\|\(e\+=1\)/
      )[0].replace('1===this.', '').replace('||(e+=1)', '');
      console.log(size);

      eval(
        c.replaceAll(
          '#AAD751',
          settings.lightSquares
        ).replaceAll(
          '#A2D149',
          settings.darkSquares
        ).replace(
          `Math.floor(c/${wa}),Math.floor(d/${wa})));`,
          `a.${size} === 3 ? ${settings.width} : Math.floor(c/${wa}), a.${size} === 3 ? ${settings.height} : Math.floor(d/${wa})));a.${size} === 3 && (${wa} = ${squareSize});console.log(a.${size});`
        )
      );
    };
    req.send();
  }
};
