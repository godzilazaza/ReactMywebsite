
import cv2
import numpy as np

# face detact library
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

cap = cv2.VideoCapture(0)
font = cv2.FONT_HERSHEY_SIMPLEX

if not cap.isOpened():
    print("can't open you camera")
    exit()
while True:
    ret, frame = cap.read()
    if not ret:
        print("can't open you camera")
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) #RGB 2 GRAY เพื่อให้ตรวจจับภาพได้ง่าย
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
    cv2.imshow("camera", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()
