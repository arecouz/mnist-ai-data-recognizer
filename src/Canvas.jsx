import React, { useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const styles = {
  border: '0.0625rem solid #9c9c9c',
  borderRadius: '0.25rem',
};

const Canvas = () => {
  // Create a ref to access the ReactSketchCanvas instance
  const sketchRef = useRef(null);

  // Clear the canvas
  const clearCanvasHandler = () => {
    if (sketchRef.current) {
      sketchRef.current.clearCanvas();
    }
  };

  // Convert the canvas to a 28x28 pixel array of inverted grayscale values
  const getImageAsArray = async () => {
    if (sketchRef.current) {
      try {
        // Export image as base64 PNG
        const base64Image = await sketchRef.current.exportImage('png');
        const image = new Image();
        image.src = base64Image;

        // Wait for the image to load
        image.onload = () => {
          // Create a canvas to extract pixel data
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set the canvas size to 28x28 (resize the original image)
          const targetWidth = 28;
          const targetHeight = 28;
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw the resized image onto the canvas
          ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

          // Get the image data (pixel values)
          const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          const data = imageData.data; // RGBA array

          // Convert the RGBA data to inverted grayscale array
          const grayscaleArray = [];
          for (let i = 0; i < data.length; i += 4) {
            // Use the average of the RGB values to compute grayscal
            const r = data[i];     // Red
            const g = data[i + 1]; // Green
            const b = data[i + 2]; // Blue
            const alpha = data[i + 3]; // Alpha (opacity)

            // Grayscale formula (luminosity method)
            let grayscale = (r * 0.3 + g * 0.59 + b * 0.11) / 255;

            // Invert the grayscale value so that white = 0 and black = 1
            grayscale = 1 - grayscale;
            grayscale = parseFloat(grayscale.toFixed(3));

            grayscaleArray.push(grayscale); // Normalized value between 0 and 1
          }

          console.log('Inverted Grayscale Array (28x28):', grayscaleArray);
          // You can store or use this 28x28 grayscale array for further processing
        };
      } catch (error) {
        console.error('Error exporting image:', error);
      }
    }
  };

  return (
    <div>
      <ReactSketchCanvas
        ref={sketchRef} // Attach the ref to the ReactSketchCanvas
        style={styles}
        width={280}
        height={280}
        strokeWidth={12}
        strokeColor="grey"
      />

      <div>
        {/* Clear Canvas Button */}
        <button onClick={clearCanvasHandler}>Clear Canvas</button>

        {/* Export as Array of Inverted Grayscale Values (Resized to 28x28) Button */}
        <button onClick={getImageAsArray}>Export as 28x28 Array</button>
      </div>
    </div>
  );
};

export default Canvas;
