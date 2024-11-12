import { NeuralNetwork } from 'brain.js';

self.onmessage = function (e) {
  const { trainingSet, config } = e.data;
  const net = new NeuralNetwork();

  // Train with logging on each iteration
  net.train(trainingSet, {
    ...config,
    log: (stats) => {
      self.postMessage({ type: 'log', stats });
    },
    logPeriod: 1,
  });

  // Send message when training is done
  self.postMessage({ type: 'done', net: net.toJSON() });
};
