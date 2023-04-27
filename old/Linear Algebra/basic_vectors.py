import numpy as np
import matplotlib.pyplot as plt

# Define the vertices of the triangle using vectors
v1 = np.array([0, 0])
v2 = np.array([1, 2])
v3 = np.array([2, 1])

# Plot the triangle
plt.plot([v1[0], v2[0]], [v1[1], v2[1]], color='b')
plt.plot([v2[0], v3[0]], [v2[1], v3[1]], color='b')
plt.plot([v3[0], v1[0]], [v3[1], v1[1]], color='b')


# Define a transformation matrix
A = np.array([[2, 1], [-1, 1]])

# Define a vector
v = np.array([1, 1])

# Perform a linear transformation
transformed_v = np.dot(A, v)

# Plot the original and transformed vectors
plt.quiver([0, 0], [0, 0], [v[0], transformed_v[0]], [v[1], transformed_v[1]],
           angles='xy', scale_units='xy', scale=1)
plt.xlim(-3, 3)
plt.ylim(-3, 3)
plt.xlabel('x')
plt.ylabel('y')
plt.title('Linear Transformation')
plt.grid()
plt.show()
