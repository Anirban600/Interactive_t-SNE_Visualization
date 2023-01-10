from js import document
from pyodide import create_proxy
from sklearn.neighbors import KNeighborsClassifier
import numpy as np
import time

mat = np.array(data)
data = mat[:, :3]
label = mat[:, 3].astype(int)

knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(data, label)

def runPython(a):
    time.sleep(0.1)
    x = int(document.getElementById("id-input").innerText)
    loc = data[x].reshape(1, -1)
    dist, neigh = knn.kneighbors(loc)
    dist, neigh = dist[0, 1:].tolist(), neigh[0, 1:].tolist()
    for i, n in enumerate(neigh, 1):
        n_label = label[n]
        path = f"mnist/{str(n_label)}/{n}.png"
        document.getElementById(f"inner-{i}").src = path

function_proxy = create_proxy(runPython)
for elem in document.getElementsByClassName("_3d"):
    elem.addEventListener("click", function_proxy)

document.getElementById("online-color").style.backgroundColor = "#37c200"
document.getElementById("online-text").innerText = "Python Online"