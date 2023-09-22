# Information about this project
Sanomed is my ***Bachelor's Degree*** project. It was made using technologies from the MERN stack.

On the frontend, the user can discern the following functionalities:
- authentication (login or signup)
- creating a new online appointment
- editing or deleting his appointment
- reading the medical staff's reviews
- adding a review after his appointment was completed
- authorization (the user can only modify his appointments or reviews)

The backend supports everything that was mentioned above, in addition to:
- a RESTful design and CRUD operations
- role-based users (pacients and administrator)
- security measures (JWT, validators, session timer)
- file-supporting capabilities (pacients can upload images)

The databased was hosted on MongoDB Atlas, in order to mimick a production-ready application that will have a lot of information to store. 

#
As a future implementation, storing the images into a cloud service will decrease the storage use and improve overall performance.