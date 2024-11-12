import React, { useRef, useEffect, useState } from 'react';
import mnist from 'mnist';
import { Button } from './components/ui/button';
import DigitChart from './DigitChart';

const DrawScaledDigit = ({ trainedNet }) => {
  const canvasRef = useRef(null);
  const [digit, setDigit] = useState({ input: null, output: null });
  const [result, setResult] = useState([]);
  const [digitIndex, setDigitIndex] = useState(0); // Track which digit to load

  const WIDTH = 28;
  const HEIGHT = 28;
  const SCALE = 3;

  useEffect(() => {
    // Load one test example (28x28 pixels) based on the current digitIndex
    const set = mnist.set(1000, 0); // Load a larger set
    const testDigit = set.test[digitIndex % set.test.length]; // Get a digit based on the index
    setDigit(testDigit);

    // Draw the digit on an off-screen canvas
    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = WIDTH;
    offscreenCanvas.height = HEIGHT;
    mnist.draw(testDigit.input, offscreenContext, 0, 0);

    // Draw on the main canvas, scaled up
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
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
  }, [digitIndex]); // Re-run effect when digitIndex changes

  const handleClick = () => {
    if (digit.input && trainedNet) {
      const result = trainedNet.run(digit.input);
      setResult(Array.from(result));
    }
  };

  const loadNewDigit = () => {
    setDigitIndex((prevIndex) => prevIndex + 1); // Increment to load a new digit
  };

  return (
    <div className='p-9'>
      <div className='flex items-center'>
        <div className='flex flex-col'>
          <p>Expected Output: {digit.output ? digit.output : 'Loading...'}</p>
          <canvas
            ref={canvasRef}
            width={WIDTH * SCALE}
            height={HEIGHT * SCALE}
            style={{ border: '1px solid black' }}
          />
          <div className='pt-2'>
            <Button
              className='flex'
              onClick={handleClick}
              disabled={!trainedNet}
            >
              Make prediction
            </Button>
            <Button
              className='flex mt-2'
              onClick={loadNewDigit}
            >
              New Number
            </Button>
          </div>
        </div>
        <DigitChart data={result} />
      </div>
    </div>
  );
};

export default DrawScaledDigit;
