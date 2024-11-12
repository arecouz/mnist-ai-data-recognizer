import React, { useRef, useEffect, useState } from 'react';
import mnist from 'mnist';

const DrawScaledDigit = () => {
  const canvasRef = useRef(null);
  const [digit, setDigit] = useState(null)
  const WIDTH = 28;
  const HEIGHT = 28;
  const SCALE = 3;


  useEffect(() => {
    // Load one test example (28x28 pixels)
    const set = mnist.set(1, 0);
    const digit = set.test[0].input; // The 28x28 input
    setDigit(set.test[0].output)

    // Create an off-screen canvas to draw the original 28x28 image
    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = WIDTH;
    offscreenCanvas.height = HEIGHT;

    // Draw the MNIST digit on the offscreen canvas
    mnist.draw(digit, offscreenContext, 0, 0);

    // Get the main canvas and context
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas (in case anything was drawn previously)
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the smaller canvas (28x28) onto the main canvas (scaled up by 1.5x)
    context.drawImage(
      offscreenCanvas,
      0,
      0,
      WIDTH,
      HEIGHT,
      0,
      0,
      WIDTH * SCALE,
      HEIGHT * SCALE
    );
  }, []);

  return (
    <div className='p-3'>
      <p>{digit}</p>
      <canvas
        ref={canvasRef}
        width={WIDTH * SCALE}
        height={HEIGHT * SCALE}
        style={{ border: '1px solid black' }}
      />
    </div>
  );
};

export default DrawScaledDigit;
