# Frontend app design

Currently there are 4 apps and 1 main app that controls frontend routing. 

Some of these are goals and others are already implemented. I guess I'll remove this comment when it all actually works this way. 

ReadApp - Allows users to view stories, translate sentences, review sentence relevent flashcards, and save these for later study (within the DrillApp). The sentence relevent flash cards can "progress as a deck" meaning no repeats. 

DrillApp - The DrillApp allows users to view saved flash cards, stories, sentences, and translations. They can put flashcards on auto play. Drills are focused on repetition of basic facts like vocabulary, with n-sided flash cards that can include images, audio and/or text (perhaps more later). "Sides can be grouped together, such that side 2 and side 3 show on the same display, or seperate displays/card rotations. The other kind of drill focuses on procedures such as sentences or paragraphs, progresively revealing sides as the sentence/paragraph goes on, can also use images or audio. 

ProgressApp - This window will have stats of the learner's practice and drills. Perhaps it could offer specifci suggestions for review. 

TestingApp - This window will allow learners to test their knoweldge with various kinds of questions. 

MainApp - MainApp is where frontend routes are controled and acts as a common parent for state sharing between the 4 apps above. 


