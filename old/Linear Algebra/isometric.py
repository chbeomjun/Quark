import matplotlib.pyplot as plt
import numpy as np

# Define the vertices of the house
vertices = np.array([
    [0, 0, 0],
    [2, 0, 0],
    [2, 2, 0],
    [0, 2, 0],
    [1, 1, 2],
    [1, 0, 2],
    [0, 1, 2],
    [2, 1, 2],
])

# Define the edges of the house
edges = np.array([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 6],
    [1, 5],
    [2, 7],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 4],
    [4, 7],
    [7, 1],
    [7, 2],
    [6, 3],
])

# Define the transformation matrix for isometric projection
theta = np.arctan(0.5)
Rx = np.array([
    [1, 0, 0, 0],
    [0, np.cos(theta), np.sin(theta), 0],
    [0, -np.sin(theta), np.cos(theta), 0],
    [0, 0, 0, 1],
])
Ry = np.array([
    [np.cos(theta), 0, -np.sin(theta), 0],
    [0, 1, 0, 0],
    [np.sin(theta), 0, np.cos(theta), 0],
    [0, 0, 0, 1],
])
Rz = np.array([
    [np.cos(theta), np.sin(theta), 0, 0],
    [-np.sin(theta), np.cos(theta), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
])
T = np.array([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
])
M = np.dot(T, np.dot(Rx, np.dot(Ry, Rz)))

# Apply the transformation to the vertices
vertices = np.hstack([vertices, np.ones((vertices.shape[0], 1))])
vertices = np.dot(vertices, M.T)
vertices = vertices[:, :3]

# Plot the house
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.view_init(elev=20, azim=-120)
for edge in edges:
    ax.plot(vertices[edge, 0], vertices[edge, 1], vertices[edge, 2], c='k')
    plt.axis('off')
    plt.show()
