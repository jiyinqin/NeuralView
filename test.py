from model.DNN import DNN

from keras.datasets import mnist
from keras.utils import np_utils
(X_train, Y_train), (X_test, Y_test) = mnist.load_data()
X_train = X_train.reshape(X_train.shape[0], -1) / 255.   # normalize
X_test = X_test.reshape(X_test.shape[0], -1) / 255.      # normalize
Y_train = np_utils.to_categorical(Y_train, num_classes=10)
Y_test = np_utils.to_categorical(Y_test, num_classes=10)

input_dim = 784
output_dim = 10
units = [32, 64, 32]
units_activation = ['relu', 'relu']
units_dropout = [0.5, 0.5]
op_name = 'RMSprop'
loss = 'categorical_crossentropy'
metrics = ['accuracy']


model = DNN(input_dim = input_dim, 
            output_dim = output_dim, 
            units = units,
            units_dropout = units_dropout,
            units_activation = units_activation)

model.train(X_train, Y_train, op_name = op_name, loss = loss, metrics = metrics, batch_size = 32)