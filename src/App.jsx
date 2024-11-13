import { NeuralNetwork } from 'brain.js';
import { useState } from 'react';
import mnist from 'mnist';
import Stats from './Stats';
import DrawDigit from './DrawDigit';
import { Button } from './components/ui/button';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [trainedNet, setTrainedNet] = useState(null); // New state for trained network
  const [trainingSet, setTrainingSet] = useState(null);
  const [testSet, setTestSet] = useState(null);
  const [stats, setStats] = useState([]);

  let worker; // Worker reference to be initialized when training starts

  // Function to load the training set
  const loadTrainingSet = () => {
    setIsLoading(true);
    const set = mnist.set(2000, 20);
    setTrainingSet(set.training);
    setTestSet(set.test);
    setIsLoading(false);
  };

  // Function to train the model with a Web Worker
  const trainModel = () => {
    if (!trainingSet || !testSet) {
      alert('Training set is not loaded!');
      return;
    }

    setIsTraining(true);

    // Initialize worker
    worker = new Worker(new URL('./trainWorker.js', import.meta.url), {
      type: 'module',
    });

    // Listen for messages from the worker
    worker.onmessage = (e) => {
      const { type, stats, net } = e.data;

      if (type === 'log') {
        setStats((prevStats) => [...prevStats, stats]);
      } else if (type === 'done') {
        setIsTraining(false);
        setIsTrained(true);

        // Load the trained network to use for predictions
        const trainedNet = new NeuralNetwork({ gpu: false }).fromJSON(net);
        setTrainedNet(trainedNet); // Store the trained network in state

        // Terminate the worker after training completes
        worker.terminate();
      }
    };

    // Start training in the worker
    worker.postMessage({
      trainingSet,
      config: {
        errorThresh: 0.005,
        iterations: 20000,
        logPeriod: 1,
      },
    });
  };

  // Function to save the trained network as a JSON file
  const saveTrainedModel = () => {
    if (!trainedNet) {
      alert('No trained model to save!');
      return;
    }

    const modelJSON = trainedNet.toJSON(); // Serialize the trained model
    const blob = new Blob([JSON.stringify(modelJSON)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'trained-model.json'; // Set the name of the download file
    link.click();
  };

  return (
    <div>
      <h1 className="text-3xl underline p-4">MNIST - AI Handwritten Digit Recognition</h1>
      
      {/* Load Training Data */}
      <div>
        <p className="p-3">Step 1: Load the training data.</p>
        <Button
          className="ml-6"
          onClick={loadTrainingSet}
          disabled={isLoading || isTrained || trainingSet}
        >
          {trainingSet ? 'Training set loaded' : 'Load Training Set'}
        </Button>
      </div>

      {/* Train the Model */}
      <div>
        <p className="p-3">Step 2: Train the model using the training data.</p>
        <Button
          className="ml-6"
          onClick={trainModel}
          disabled={isTraining || !trainingSet || isTrained}
        >
          {isTraining ? 'Training Model...' : 'Train Model'}
        </Button>
      </div>

      {/* Save Model Button */}
      <div>
        {isTrained && (
          <Button
            className="ml-6"
            onClick={saveTrainedModel}
            disabled={!trainedNet}
          >
            Save Trained Model
          </Button>
        )}
      </div>

      {/* Stats Display */}
      <div>
        <Stats stats={stats} />
      </div>

      {/* Displaying Model Status */}
      <div>
        <div>
          {!isTrained ? (
            <p className="text-xl underline p-4">Once the error threshold is met...</p>
          ) : (
            <p className="text-xl underline p-4">Model successfully trained!</p>
          )}

          <p className="p-3">
            Step 3: Use the model to make predictions on the test set. These numbers are all new to the model.
          </p>
          {/* Pass the trained network as a prop to DrawDigit */}
          <DrawDigit trainedNet={trainedNet} />
        </div>
      </div>
    </div>
  );
};

export default App;
