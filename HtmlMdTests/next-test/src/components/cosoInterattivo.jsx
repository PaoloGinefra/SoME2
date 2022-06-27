import dynamic from "next/dynamic";

// importare in questo modo segnala a Next che questo componente non deve essere renderizzato in HTML statico,
// cosa che altrienti farebbe crashare tutto perchè p5 cerca di accedere all'oggetto window che non esiste lato server
const Sketch = dynamic(() => import("react-p5").then((mod) => mod.default), {
  ssr: false,
});

const CosoInterattivo = () => {
  let x = 100;
  let y = 100;
  let size = 50;
  let speedX = 4 * (Math.random() - 0.5);
  let speedY = 4 * (Math.random() - 0.5);

  const setup = (p, canvasParentRef) => {
    p.createCanvas(500, 500).parent(canvasParentRef);
  };

  const draw = (p) => {
    p.background(0);

    p.fill(255);
    p.rect(x, y, size, size);

    x += speedX;
    y += speedY;

    if (x <= 0 || x + size >= p.width) {
      speedX = -speedX;
    }

    if (y <= 0 || y + size >= p.height) {
      speedY = -speedY;
    }
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default CosoInterattivo;
